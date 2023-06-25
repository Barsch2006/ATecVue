import { Db } from "mongodb";
import IEvent from "./event";
import { Router } from "express";
import ATecBot from "../Bot/Bot";

// return a router with the event create route
export default function createEvent(db: Db, discord: ATecBot): Router {

    const router = Router();

    const eventCollection = db.collection<IEvent>("events");

    router.post('/event', async (req, res) => {

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

        // check if the body is valid and has all properties of IEvent
        if (!req.body || !validateBody(req.body)) {
            res.status(400).send("Bad Request");
            return;
        }

        // when user is authenticated and body is valid, write event to the database
        const result = await eventCollection.insertOne({
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            position: req.body.position,
            title: req.body.title,
            description: req.body.description,
            targetgroup: req.body.targetgroup,
            start: req.body.start,
            end: req.body.end,
            location: req.body.location,
            participants: [],
            microphones: req.body.microphones,
            notes: req.body.notes,
            beamer: req.body.beamer,
            hdmi: req.body.hdmi,
            vga: req.body.vga,
            usb: req.body.usb,
            headsets: req.body.headsets,            
        });

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

        await eventCollection.updateOne({ _id: result.insertedId }, { $set: { discordMessageId: dcMessageId } });

        // send the id of the event back to the client
        res.status(200).send(result.insertedId);

    });

    return router;

}

function validateBody(body: any): body is IEvent {
    if (!body) return false;
    if (!body.name || typeof body.name !== "string") return false;
    console.log(`Name ${body.name} is valid`)
    if (!body.lastname || typeof body.lastname !== "string") return false;
    console.log(`Lastname ${body.lastname} is valid`)
    if (!body.email || typeof body.email !== "string") return false;
    console.log(`E-mail ${body.email} is valid`)
    if (!body.position || typeof body.position !== "string") return false;
    console.log(`position ${body.position} is valid`)
    if (!body.title || typeof body.title !== "string") return false;
    console.log(`title ${body.title} is valid`)
    if (!body.description || typeof body.description !== "string") return false;
    console.log(`description ${body.description} is valid`)
    if (!body.targetgroup || typeof body.targetgroup !== "string") return false;
    console.log(`targetgroup ${body.targetgroup} is valid`)
    if (!body.start || typeof body.start !== "number") return false;
    console.log(`start ${body.start} is valid`)
    if (!body.end || typeof body.end !== "number") return false;
    console.log(`end ${body.end} is valid`)
    if (!body.location || typeof body.location !== "string") return false;
    console.log(`location ${body.location} is valid`)
    if (body.microphones == undefined || typeof body.microphones !== "number") return false;
    console.log(`microphones ${body.microphones} is valid`)
    if (body.headsets == undefined || typeof body.headsets !== "number") return false;
    console.log(`headsets ${body.headsets} is valid`)
    if (body.beamer == undefined || typeof body.beamer !== "boolean") return false;
    console.log(`beamer ${body.beamer} is valid`)
    if (body.hdmi == undefined || typeof body.hdmi !== "boolean") return false;
    console.log(`hdmi ${body.hdmi} is valid`)
    if (body.vga == undefined || typeof body.vga !== "boolean") return false;
    console.log(`vga ${body.vga} is valid`)
    if (body.usb == undefined || typeof body.usb !== "boolean") return false;
    console.log(`usb ${body.usb} is valid`)
    if (body.notes != undefined && typeof body.notes !== "string") return false;
    console.log(`notes ${body.notes} is valid`)
    console.log(`body is valid`)
    return true;
}
