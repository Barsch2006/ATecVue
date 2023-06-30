import { Db } from "mongodb";
import { Router } from "express";
import ILog from "./ilog";

// return a router with the event create route
export default function createEvent(db: Db): Router {
    const router = Router();

    const logCollection = db.collection<ILog>("events");

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

            // check if the body is valid and has all properties of IEvent
            if (!req.body || !validateBody(req.body)) {
                res.status(400).send("Bad Request");
                return;
            }

            // insert log into database
            const result = await logCollection.insertOne(req.body);
            // send the id of the inserted log to the client
            res.status(200).json(result.insertedId);
        } catch (error) {
            console.error("Error creating event:", error);
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

            // check if the body is valid and has all properties of IEvent
            if (!req.body || !validateBody(req.body)) {
                res.status(400).send("Bad Request");
                return;
            }

            // insert log into database
            const result = await logCollection.insertOne(req.body);
            // send the id of the inserted log to the client
            res.status(200).json(result.insertedId);

        } catch (error) {
            console.error("Error creating event:", error);
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
            if (!req.auth?.user || req.auth?.user.permissionLevel != "locked") {
                res.status(403).send("Forbidden");
                return;
            }

            // get the logs of the last 3month from the database
            const logs = await logCollection
                .find({
                    timestamp: {
                        $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 90),
                    },
                })
                .toArray();
            // send the logs to the client
            res.status(200).json(logs);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    return router;
}

function validateBody(body: ILog): body is ILog {
    if (!body) return false;
    if (!body.name || typeof body.name !== "string") return false;
    if (!body.lastname || typeof body.lastname !== "string") return false;
    if (!body.contact || typeof body.contact !== "string") return false;
    if (!body.position || typeof body.position !== "string") return false;
    if (!body.type || typeof body.type !== "string") return false;
    if (!body.event_name || typeof body.event_name !== "string") return false;
    if (!body.event_description || typeof body.event_description !== "string") return false;
    if (!body.event_location || typeof body.event_location !== "string") return false;
    if (!body.event_date || typeof body.event_date !== "string") return false;
    if (!body.event_time || typeof body.event_time !== "string") return false;
    if (!body.usage_aula || typeof body.usage_aula !== "boolean") return false;
    if (!body.usage_backstage || typeof body.usage_backstage !== "boolean") return false;
    if (!body.usage_chairs || typeof body.usage_chairs !== "boolean") return false;
    if (!body.usage_mobile || typeof body.usage_mobile !== "boolean") return false;
    if (!body.usage_regie || typeof body.usage_regie !== "boolean") return false;
    if (!body.usage_stage || typeof body.usage_stage !== "boolean") return false;
    if (!body.checklist.backstageLightsOff || typeof body.checklist.backstageLightsOff !== "boolean") return false;
    if (!body.checklist.doorsClosed || typeof body.checklist.doorsClosed !== "boolean") return false;
    if (!body.checklist.emergencyDoorsClosed || typeof body.checklist.emergencyDoorsClosed !== "boolean") return false;
    if (!body.checklist.lightsOff || typeof body.checklist.lightsOff !== "boolean") return false;
    if (!body.checklist.lockesClosed || typeof body.checklist.lockesClosed !== "boolean") return false;
    if (!body.checklist.systemOff || typeof body.checklist.systemOff !== "boolean") return false;
    return true;
}
