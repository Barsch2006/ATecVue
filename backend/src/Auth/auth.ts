import { Router } from "express";
import IUser from "./user";
import { Db, ObjectId, WithId } from "mongodb";
import { compare, hash } from "bcrypt";

import { sign, verify } from "jsonwebtoken";
import { randomBytes } from "crypto";

interface ISession {
    userId: ObjectId;
    token: string;
    expires: number;
}

declare global {
    namespace Express {
        interface Request {
            auth?: {
                user?: WithId<IUser>;
                authenticated: boolean;
            };
        }
    }
}

export default function auth(db: Db): Router {
    const router = Router();
    const userCollection = db.collection<IUser>("users");
    const sessions = db.collection<ISession>("sessions");

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not set");
    }

    router.post("/login", async (req, res) => {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not set");
        }

        try {
            // check if body includes username + password
            if (!req.body || !req.body.username || !req.body.password) {
                res.status(400).send("Bad Request");
                return;
            }

            // get the user from the database
            const user = await userCollection.findOne({ username: req.body.username });

            // compare passwords with bcrypt

            if (!user) {
                res.status(401).send("Unauthorized");
                return;
            }

            if (user.permissionLevel === "locked") {
                res.status(403).send("Forbidden");
                return;
            }

            if (await compare(req.body.password, user.password)) {
                try {
                    // create a token
                    let token = randomBytes(32).toString("base64");

                    // sign token
                    let signed = sign(
                        {
                            userId: user._id.toHexString(),
                            token,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "2h",
                        }
                    );

                    // set cookie
                    res.cookie("token", signed, {
                        expires: new Date(Date.now() + 1000 * 60 * 60),
                        sameSite: "none",
                        secure: true,
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60,
                    });

                    res.cookie("usertype", user.permissionLevel, {
                        expires: new Date(Date.now() + 1000 * 60 * 60),
                        maxAge: 1000 * 60 * 60,
                    });

                    // save token in database

                    await sessions.insertOne({
                        userId: user._id,
                        token,
                        expires: Date.now() + 1000 * 60 * 60,
                    });

                    res.end("OK");
                    return;
                } catch (error) {
                    res.status(500).send("Internal Server Error");
                    return;
                }
            }

            res.status(401).send("Unauthorized");
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    });

    router.use(async (req, _, next) => {
        try {
            if (req.cookies.token) {
                // check if token is valid and in db
                if (!process.env.JWT_SECRET) {
                    throw new Error("JWT_SECRET not set");
                }
                try {
                    const data = verify(req.cookies.token, process.env.JWT_SECRET, {
                        ignoreExpiration: true,
                    }) as any;

                    // check if data is in db
                    const session = await sessions.findOne({
                        userId: new ObjectId(data.userId),
                        token: data.token,
                    });


                    if (session && session.expires > Date.now()) {

                        req.auth = {
                            authenticated: true,
                            user:
                                (await userCollection.findOne({
                                    _id: new ObjectId(data.userId),
                                })) ?? undefined,
                        };
                        next();
                        return;
                    }
                } catch (e) {
                    req.auth = {
                        authenticated: false,
                    }
                    next();
                    return;
                }
            }

            req.auth = {
                authenticated: false,
                user: undefined,
            };

            next();
        } catch (error) {
            req.auth = {
                authenticated: false,
                user: undefined,
            };
            next();
        }
    });

    router.get("/logout", async (req, res) => {
        try {
            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }
            if (!req.auth?.user) {
                res.status(400).send("Bad Request");
                return;
            }

            // delete session from database
            await sessions.deleteMany({
                userId: req.auth.user._id,
            });

            // delete cookie
            res.clearCookie("token");
            res.clearCookie("usertype");

            res.status(200).send("Logout erfolgreich");
        } catch {
            res.status(500).send("Internal Server Error");
        }
    });

    router.post("/chpwd", async (req, res) => {
        try {
            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }
            if (!req.auth?.user) {
                res.status(400).send("Bad Request");
                return;
            }
            if (req.auth?.user?.permissionLevel === "shared") {
                res.status(403).send("Forbidden");
                return;
            }

            if (!req.body || !req.body.newPassword || !req.body.oldPassword) {
                res.status(400).send("Bad Request");
                return;
            }

            // compare old password
            if (!(await compare(req.body.oldPassword, req.auth.user.password))) {
                res.status(401).send("Unauthorized");
                return;
            }

            // update password

            const updateResult = await userCollection.updateOne(
                {
                    _id: req.auth.user._id,
                },
                {
                    $set: {
                        password: await hash(req.body.newPassword, 10),
                    },
                }
            );

            if (!updateResult.acknowledged) {
                res.status(500).send("Internal Server Error");
                return;
            }

            res.status(200).send("OK");

        } catch {
            res.status(500).send("Internal Server Error");
        }
    });

    router.get("/checkaccess", (req, res) => {
        if (!req.auth?.authenticated) {
            res.status(401).send("Unauthorized");
            return;
        }
        
        if (req.auth?.user?.permissionLevel === "admin") {
            res.status(200).json({
                technicianAccess: "granted",
                adminAccess: "granted",
            })
            return;
        }

        if (req.auth?.user?.permissionLevel === "technician") {
            res.status(200).json({
                technicianAccess: "granted",
                adminAccess: "denied",
            })
            return;
        }

        res.status(200).json({
            technicianAccess: "denied",
            adminAccess: "denied",
        });
    })


    setInterval(async () => {
        try {
            await sessions.deleteMany({
                expires: {
                    $lt: Date.now(),
                },
            });
        } catch {
            console.error("Error cleaning expired sessions");
        }
    }, 1000 * 5 * 60);

    return router;
}
