import { Db, GridFSBucket, ObjectId } from "mongodb";
import IEvent from "./event";
import { Router } from "express";
import ATecBot from "../Bot/Bot";
import multer from "multer";

// return a router with the event create route
export default function createEvent(db: Db, discord: ATecBot): Router {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  const eventCollection = db.collection<IEvent>("events");

  router.post("/event", upload.any(), async (req, res) => {
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

      const data = JSON.parse(req.body.data);

      // check if the body is valid and has all properties of IEvent
      if (!req.body.data || !validateBody(data)) {
        res.status(400).send("Bad Request");
        return;
      }

      const bucket = new GridFSBucket(db);
      const uploadedFileIds: { id: ObjectId; filename: string }[] = Array<{
        id: ObjectId;
        filename: string;
      }>();
      for (const file of req.files as Express.Multer.File[]) {
        // check if the file type is allowed (".html, image/*, .zip, .pdf, .txt, .pptx, .csv, video/*, audio/*")
        if (
          !file.mimetype.match(
            /text\/html|image\/.*|application\/zip|application\/pdf|text\/plain|application\/vnd.openxmlformats-officedocument.presentationml.presentation|text\/csv|video\/.*|audio\/.*/
          )
        ) {
          res.status(400).send("Bad Request");
          return;
        }

        const uploadStream = bucket.openUploadStream(file.originalname);
        uploadedFileIds.push({
          id: uploadStream.id,
          filename: file.originalname,
        });

        uploadStream.end(file.buffer); // Write the buffer directly
      }

      // when user is authenticated and body is valid, write event to the database
      const result = await eventCollection.insertOne({
        createdBy: req.auth?.user._id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        position: data.position,
        title: data.title,
        description: data.description,
        targetgroup: data.targetgroup,
        start: data.start,
        end: data.end,
        location: data.location,
        participants: [],
        microphones: data.microphones,
        notes: data.notes,
        beamer: data.beamer,
        hdmi: data.hdmi,
        vga: data.vga,
        usb: data.usb,
        headsets: data.headsets,
        files: uploadedFileIds,
      });

      // check if the event was written to the database
      if (!result.acknowledged || !result.insertedId) {
        return;
      }

      const dcMessageId = await discord.sendEventForm({
        createdBy: req.auth?.user._id,
        _id: result.insertedId,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        position: data.position,
        title: data.title,
        description: data.description,
        targetgroup: data.targetgroup,
        start: data.start,
        end: data.end,
        location: data.location,
        participants: [],
        microphones: data.microphones,
        notes: data.notes,
        beamer: data.beamer,
        hdmi: data.hdmi,
        vga: data.vga,
        usb: data.usb,
        headsets: data.headsets,
      });

      if (!dcMessageId) {
        res.status(500).send("Internal Server Error");
        return;
      }

      await eventCollection.updateOne(
        { _id: result.insertedId },
        { $set: { discordMessageId: dcMessageId } }
      );

      // send the id of the event back to the client
      res.status(200).send(result.insertedId);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/event/:id", async (req, res) => {
    try {
      console.log(req.auth?.authenticated);
      // check if the user is logged in and an admin
      if (!req.auth?.user || req.auth?.user.permissionLevel != "admin") {
        res.status(403).send("Forbidden");
        return;
      }

      // check if the id is valid
      if (!req.params.id) {
        res.status(400).send("Bad Request");
        return;
      }

      // check if the event exists
      const event = await eventCollection.findOne({
        _id: ObjectId.createFromHexString(req.params.id),
      });
      if (!event) {
        res.status(404).send("Not Found");
        return;
      }

      // delete all saved files
      if (event.files && event.files.length > 0) {
        const bucket = new GridFSBucket(db);
        for (const file of event.files) {
          await bucket.delete(new ObjectId(file.id));
        }
      }

      // delete the event
      const result = await eventCollection.deleteOne({
        _id: ObjectId.createFromHexString(req.params.id),
      });
      if (!result.acknowledged) {
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  return router;
}

function validateBody(body: any): body is IEvent {
  if (!body) return false;
  if (!body.name || typeof body.name !== "string") return false;
  console.log(`Name ${body.name} is valid`);
  if (!body.lastname || typeof body.lastname !== "string") return false;
  console.log(`Lastname ${body.lastname} is valid`);
  if (!body.email || typeof body.email !== "string") return false;
  console.log(`E-mail ${body.email} is valid`);
  if (!body.position || typeof body.position !== "string") return false;
  console.log(`position ${body.position} is valid`);
  if (!body.title || typeof body.title !== "string") return false;
  console.log(`title ${body.title} is valid`);
  if (!body.description || typeof body.description !== "string") return false;
  console.log(`description ${body.description} is valid`);
  if (!body.targetgroup || typeof body.targetgroup !== "string") return false;
  console.log(`targetgroup ${body.targetgroup} is valid`);
  if (!body.start || typeof body.start !== "number") return false;
  console.log(`start ${body.start} is valid`);
  if (!body.end || typeof body.end !== "number") return false;
  console.log(`end ${body.end} is valid`);
  if (!body.location || typeof body.location !== "string") return false;
  console.log(`location ${body.location} is valid`);
  if (body.microphones === undefined || typeof body.microphones !== "number")
    return false;
  console.log(`microphones ${body.microphones} is valid`);
  if (body.headsets === undefined || typeof body.headsets !== "number")
    return false;
  console.log(`headsets ${body.headsets} is valid`);
  if (body.beamer === undefined || typeof body.beamer !== "boolean")
    return false;
  console.log(`beamer ${body.beamer} is valid`);
  if (body.hdmi === undefined || typeof body.hdmi !== "boolean") return false;
  console.log(`hdmi ${body.hdmi} is valid`);
  if (body.vga === undefined || typeof body.vga !== "boolean") return false;
  console.log(`vga ${body.vga} is valid`);
  if (body.usb === undefined || typeof body.usb !== "boolean") return false;
  console.log(`usb ${body.usb} is valid`);
  if (body.notes !== undefined && typeof body.notes !== "string") return false;
  console.log(`notes ${body.notes} is valid`);
  console.log(`body is valid`);
  return true;
}
