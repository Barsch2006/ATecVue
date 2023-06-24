import { Db, ObjectId } from "mongodb";
import IEvent from "./event";
import { Router } from "express";

export default function viewEvents(db: Db): Router {

    const router = Router();

    const eventCollection = db.collection<IEvent>("events");

    router.get('/event/:id', async (req, res) => {

        if (!req.isAuthenticated()) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a atec member
        if (!req.user || req.user.permissionLevel != "technician" && req.user.permissionLevel != "admin") {
            res.status(403).send("Unauthorized");
            return;
        }

        const event = await eventCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (event) {
            res.send(event);
        } else {
            res.status(404).send("Event not found");
        }
    });

    // get all events, sorted by date and in a short format
    router.get('/events', async (req, res) => {
        if (!req.isAuthenticated()) {
            res.status(401).send("Unauthorized");
            return;
        }

        // check if the user is logged in and at least a atec member
        if (!req.user || req.user.permissionLevel != "technician" && req.user.permissionLevel != "admin") {
            res.status(403).send("Unauthorized");
            return;
        }

        const events = await eventCollection.find().map(event => {
            return {
                _id: event._id,
                title: event.title,
                description: event.description,
                date: event.date,
                start: event.start,
                end: event.end,
                location: event.location,
                notes: event.notes,
            }
        }).sort({ date: 1 }).toArray();
        res.send(events);
    });

    return router;
}
