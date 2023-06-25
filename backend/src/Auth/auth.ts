import { Router } from "express";
import IUser from "./user";
import { Db, ObjectId, WithId } from "mongodb";
import { compare } from "bcrypt";

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
            }
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

        if (await compare(req.body.password, user.password)) {

            // create a token
            let token = randomBytes(32).toString("base64");

            // sign token
            let signed = sign({
                userId: user._id.toHexString(),
                token
            }, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            // set cookie
            res.cookie("token", signed, {
                expires: new Date(Date.now() + 1000 * 60 * 60),
                sameSite: "none",
                secure: true,
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });
            console.log("Cookie Set", signed);

            // save token in database

            await sessions.insertOne({
                userId: user._id,
                token,
                expires: Date.now() + 1000 * 60 * 60
            });

            res.end("OK");
            return;
        }

        res.status(401).send("Unauthorized");
    });


    router.use(async (req, _, next) => {
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
                    token: data.token
                });

                if (session) {
                    req.auth = {
                        authenticated: true,
                        user: await userCollection.findOne({
                            _id: new ObjectId(data.userId)
                        }) ?? undefined,
                    }
                    next();
                    return;
                }
            } catch (e) {
                req.auth = {
                    authenticated: false,
                    user: undefined,
                }
                next();
                return;
            }

        }

        req.auth = {
            authenticated: false,
            user: undefined,
        }

        next();

    });

    router.get("/logout", async (req, res) => {
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
            userId: req.auth.user._id
        });

        // delete cookie
        res.clearCookie("token");

        res.status(200).send("OK");

    });

    setInterval(async () => {

        await sessions.deleteMany({
            expires: {
                $lt: Date.now()
            }
        });

    }, 1000 * 5 * 60);

    return router;

}