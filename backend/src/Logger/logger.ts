import { Db } from "mongodb";
import { Router } from "express";
import ILog from "./ilog";
import ATecBot from "Bot/Bot";

// return a router with the event create route
export default function createEvent(bot: ATecBot,  db: Db): Router {
    const router = Router();

    const logCollection = db.collection<ILog>("logs");

    router.delete('/logs', async (req, res) => {
        try {
            console.log(req.auth?.authenticated);

            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }

            // check if the user is logged in and at least a admin
            if (!req.auth?.user || req.auth?.user.permissionLevel != "admin") {
                res.status(403).send("Forbidden");
                return;
            }

            bot.sendStringMessage(`Logs wurden von @<${req.auth.user.dId}> gelöscht`);

            // delete all logs from the database
            const result = await logCollection.deleteMany({});
            // send the number of deleted logs to the client
            res.status(200).json(result.deletedCount);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    router.post("/checkin", async (req, res) => {
        try {
            console.log(req.auth?.authenticated);

            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }

            // check if the user is logged in and at least a user (not locked)
            if (!req.auth?.user || req.auth?.user.permissionLevel === "locked") {
                res.status(403).send("Forbidden");
                return;
            }

            // check if the body is valid
            if (!req.body) {
                res.status(400).send("Bad Request");
                return;
            }

            // insert log into database
            const result = await logCollection.insertOne(req.body);

            // send the id of the inserted log to the client
            res.status(200).json(result.insertedId);
        } catch (error) {
            console.error("Error creating log:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    router.post("/checkout", async (req, res) => {
        try {
            console.log(req.auth?.authenticated);

            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }

            // check if the user is logged in and at least a user (not locked)
            if (!req.auth?.user || req.auth?.user.permissionLevel === "locked") {
                res.status(403).send("Forbidden");
                return;
            }

            // check if the body is valid
            if (!req.body) {
                res.status(400).send("Bad Request");
                return;
            }

            // insert log into database
            const result = await logCollection.insertOne(req.body);

            // send the id of the inserted log to the client
            res.status(200).json(result.insertedId);

        } catch (error) {
            console.error("Error creating log:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    router.get("/logs", async (req, res) => {
        try {
            console.log(req.auth?.authenticated);

            if (!req.auth?.authenticated) {
                res.status(401).send("Unauthorized");
                return;
            }

            // check if the user is logged in and at least a user (not locked)
            if (!req.auth?.user || req.auth?.user.permissionLevel == "locked") {
                res.status(403).send("Forbidden");
                return;
            }

            // get the logs of the last 3 month from the database
            const logs = await logCollection.find().toArray();
            // send the logs to the client
            res.status(200).json(logs);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    return router;
}
