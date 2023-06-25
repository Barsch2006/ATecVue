import { Db } from "mongodb";
import ILog from "./log";
import { Router } from "express";

// return a router with the event create route
export default function createEvent(db: Db): Router {

    const router = Router();

    const logCollection = db.collection<ILog>("logs");

    router.post('/log', async (req, res) => {

        console.log(req.auth?.authenticated)

        if (!req.auth?.authenticated) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a user (not locked)
        if (!req.auth?.user || req.auth?.user.permissionLevel === "locked") {
            res.status(403).send("Forbidden");
            return;
        }

        // check if the body is valid and has all properties of ILog
        if (!req.body || !validateBody(req.body)) {
            res.status(400).send("Bad Request");
            return;
        }

        // when user is authenticated and body is valid, write event to the database
        const result = await logCollection.insertOne({
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            text: req.body.text,
            type: req.body.type,
        });

        // check if the event was written to the database
        if (!result.acknowledged || !result.insertedId) {
            res.status(500).send("Internal Server Error");
            return;
        }

        // send the id of the event back to the client
        res.status(200).send(result.insertedId);
    });

    router.get('/logs', async (req, res) => {
        if (!req.auth?.authenticated) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a user (not locked)
        if (!req.auth?.user || req.auth?.user.permissionLevel == "locked") {
            res.status(403).send("Forbidden");
            return;
        }

        const result = await logCollection.find().toArray();

        res.status(200).json(result);
    });

    return router;

}

function validateBody(body: any): body is ILog {
    if (!body) return false;
    if (!body.name) return false;
    if (!body.date) return false;
    if (!body.time) return false;
    if (!body.text) return false;
    if (!body.type) return false;
    return true;
}
