import { Db, GridFSBucket, ObjectId } from "mongodb";
import IEvent from "./event";
import { Router } from "express";
import multer from "multer";

export default function viewEvents(db: Db): Router {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  const eventCollection = db.collection<IEvent>("events");

  router.get("/event/:id", async (req, res) => {
    try {
      if (!req.auth?.authenticated) {
        res.status(401).send("Unauthorized");
        return;
      }

      // check if the user is logged in and at least a user (not locked)
      if (
        !req.auth?.user ||
        (req.auth?.user.permissionLevel != "technician" &&
          req.auth?.user.permissionLevel != "admin")
      ) {
        res.status(403).send("Forbidden");
        return;
      }

      const eventId = req.params.id;

      try {
        const event = await eventCollection.findOne({
          _id: new ObjectId(eventId),
        });
        if (event) {
          interface IEventLighter extends Omit<IEvent, "createdBy"> {}
          const sendevent = event as IEventLighter;
          res.send(sendevent);
        } else {
          res.status(404).send("Event not found");
        }
      } catch (error) {
        console.error("Error retrieving event:", error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error("Error retrieving event:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // get all events, sorted by date and in a short format
  router.get("/events", async (req, res) => {
    try {
      if (!req.auth?.authenticated) {
        res.status(401).send("Unauthorized");
        return;
      }

      // check if the user is logged in and at least a user (not locked)
      if (
        !req.auth?.user ||
        (req.auth?.user.permissionLevel != "technician" &&
          req.auth?.user.permissionLevel != "admin")
      ) {
        res.status(403).send("Forbidden");
        return;
      }

      try {
        const events = await eventCollection
          .find()
          .map((event) => {
            return {
              _id: event._id,
              title: event.title,
              description: event.description,
              start: event.start,
              end: event.end,
              location: event.location,
              notes: event.notes,
            };
          })
          .sort({ date: 1 })
          .toArray();
        res.send(events);
      } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error("Error retrieving events:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/event/files/:id", async (req, res) => {
    try {
      // check if the user is logged in and an technician or admin
      if (
        !req.auth?.user ||
        (req.auth?.user.permissionLevel != "technician" &&
          req.auth?.user.permissionLevel != "admin")
      ) {
        res.status(403).send("Forbidden");
        return;
      }

      const bucket = new GridFSBucket(db);

      const downloadStream = bucket.openDownloadStream(
        new ObjectId(req.params.id)
      );

      // Zugriff auf Metadaten der Datei
      const fileInfo = await bucket
        .find({ _id: new ObjectId(req.params.id) })
        .toArray();

      if (fileInfo.length === 0) {
        res.status(404).send("File not found");
        return;
      }

      const filename = fileInfo[0].filename;

      // Setzen des Dateinamens im Response Header
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Streamen der Datei an das Frontend
      downloadStream.pipe(res);
    } catch (error) {
      console.error("Fehler beim Abrufen der Datei:", error);
      res.status(500).send("Fehler beim Abrufen der Datei");
    }
  });

  // post request to upload files to an event after creation (only for the event creator)
  router.post("/event/additional/:id", upload.any(), async (req, res) => {
    try {
      if (!req.auth?.authenticated) {
        res.status(401).send("Unauthorized");
        return;
      }

      // check if the user is logged in and at least a user (not locked)
      if (!req.auth?.user || req.auth?.user.permissionLevel == "locked") {
        res.status(403).send("Forbidden");
        return;
      }

      // get the event id from the request
      const eventId = req.params.id;

      // check if the event exists
      const event = await eventCollection.findOne({
        _id: new ObjectId(eventId),
      });

      if (!event) {
        res.status(404).send("Event not found");
        return;
      }

      // check if the user is the creator of the event
      if (!event.createdBy.equals(req.auth?.user._id)) {
        res.status(403).send("Forbidden");
        return;
      }

      // get the files from the request
      const files = req.files as Express.Multer.File[];

      // check if there are files
      if (!files || files.length == 0) {
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

      // add the files to the event
      await eventCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $push: { files: { $each: uploadedFileIds } } }
      );
      res.status(200).send("Files uploaded");
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // route to get all events a user created and that are not in the past
  router.get("/events/created", async (req, res) => {
    try {
      if (!req.auth?.authenticated) {
        res.status(401).send("Unauthorized");
        return;
      }

      // check if the user is logged in and at least a user (not locked)
      if (!req.auth?.user || req.auth?.user.permissionLevel == "locked") {
        res.status(403).send("Forbidden");
        return;
      }

      try {
        const events = await eventCollection
          .find({
            createdBy: req.auth?.user._id,
            start: { $gte: new Date().getTime() / 1000 },
          })
          .toArray();
        const sendevents = events.map((event) => {
          const sendevent = {
            url: `/event/additional/${event._id}`,
            name: event.title,
          };
          return sendevent;
        });

        res.send(sendevents);
      } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error("Error retrieving events:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  return router;
}
