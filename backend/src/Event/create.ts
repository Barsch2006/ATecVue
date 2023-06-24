import { Db } from "mongodb";
import IEvent from "./event";
import { Router } from "express";
import ATecBot from "../Bot/Bot";

// return a router with the event create route
export default function createEvent(db: Db, discord: ATecBot): Router {

    const router = Router();

    const eventCollection = db.collection<IEvent>("events");

    router.post('/event', async (req, res) => {

        if (!req.isAuthenticated()) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a user (not locked)
        if (!req.user || req.user.permissionLevel === "locked") {
            res.status(403).send("Unauthorized");
            return;
        }

        // check if the body is valid and has all properties of IEvent
        if (!req.body || !validateBody(req.body)) {
            res.status(400).send("Bad Request");
            return;
        }

        // when user is authenticated and body is valid, write event to the database
        const result = await eventCollection.insertOne(req.body);

        // check if the event was written to the database
        if (!result.acknowledged || !result.insertedId) {
            res.status(500).send("Internal Server Error");
            return;
        }

        const dcMessageId = await discord.sendEventForm({ ...req.body, _id: result.insertedId });

        if (!dcMessageId) {
            res.status(500).send("Internal Server Error");
            return;
        }

        await eventCollection.updateOne({ _id: result.insertedId }, { $set: { dcMessageId } });

        // send the id of the event back to the client
        res.status(200).send(result.insertedId);    

    });

    return router;

}

function validateBody (body: any): body is IEvent {
    if (!body) return false;
    if (!body.name || typeof body.name !== "string") return false;
    if (!body.lastname || typeof body.lastname !== "string") return false;
    if (!body.email || typeof body.email !== "string") return false;
    if (!body.position || typeof body.position !== "string") return false;
    if (!body.title || typeof body.title !== "string") return false;
    if (!body.description || typeof body.description !== "string") return false;
    if (!body.targetgroup || typeof body.targetgroup !== "string") return false;
    if (!body.start || typeof body.start !== "number") return false;
    if (!body.end || typeof body.end !== "number") return false;
    if (!body.location || typeof body.location !== "string") return false;
    if (!body.microphones || typeof body.microphones !== "number") return false;
    if (!body.headsets || typeof body.headsets !== "number") return false;
    if (!body.beamer || typeof body.beamer !== "boolean") return false;
    if (!body.hdmi || typeof body.hdmi !== "boolean") return false;
    if (!body.vga || typeof body.vga !== "boolean") return false;
    if (!body.usb || typeof body.usb !== "boolean") return false;
    if (body.notes != undefined && typeof body.notes !== "string") return false;
    return true;
}
