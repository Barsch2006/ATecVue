import { Db } from "mongodb";
import IUser from "../Auth/user";
import { Router } from "express";

// return a router with the event create route
export default function createEvent(db: Db): Router {

    const router = Router();

    const userCollection = db.collection<IUser>("users");

    router.post("/createuser", async (req, res) => {
        if (!req.isAuthenticated()) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a user (not locked)
        if (!req.user || req.user.permissionLevel != "admin") {
            res.status(403).send("Unauthorized");
            return;
        }

        // check if the request body is valid
        if (!req.body.username || !req.body.password || !req.body.permissionLevel || !req.body.contactAdress) {
            res.status(400).send("Bad Request");
            return;
        }

        // insert the user into the database
        const result = await userCollection.insertOne({
            username: req.body.username.toString(),
            password: req.body.password.toString(),
            permissionLevel: req.body.permissionLevel.toString(),
            contactAdress: req.body.contactAdress.toString(),
        });

        // send the result
        res.status(200).send(result.acknowledged);
    });

    // route to update a user
    router.post("/updateuser", async (req, res) => {
        if (!req.isAuthenticated()) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a admin
        if (!req.user || req.user.permissionLevel != "admin") {
            res.status(403).send("Unauthorized");
            return;
        }

        // check if the request body is valid
        if (!req.body.username || !req.body.password || !req.body.permissionLevel || !req.body.contactAdress) {
            res.status(400).send("Bad Request");
            return;
        }

        // update the user in the database
        const result = await userCollection.updateOne(
            { username: req.body.username.toString() },
            {
                $set: {
                    password: req.body.password.toString(),
                    permissionLevel: req.body.permissionLevel.toString(),
                    contactAdress: req.body.contactAdress.toString(),
                },
            }
        );

        // send the result
        res.status(200).send(result.acknowledged);
    });

    return router;
}
