import { Router } from "express";
import { Db } from "mongodb";
import { Use } from "./types/use";

export default function takeMaterial(db: Db): Router {
  const router = Router();

  const useCollection = db.collection<Use>("use");

  // get the state of an item. check if it is taken or not
  router.get("/material/items/usestate/:code", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and at least a technician
    if (
      !req.auth?.user ||
      (req.auth?.user.permissionLevel != "technician" &&
        req.auth?.user.permissionLevel != "admin")
    ) {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the code is valid
    if (!req.params.code) {
      res.status(400).send("Bad Request");
      return;
    }

    // get the latest entry of the use collection with the given code
    const use = await useCollection.findOne(
      { code: req.params.code },
      { sort: { _id: -1 } }
    );

    // if there is no entry, the item is not taken
    if (!use) {
      res.status(200).json({
        taken: false,
      });
      return;
    }

    // if the use has no back object the item is taken
    if (!use.back) {
      res.status(200).json({
        taken: true,
      });
      return;
    }

    // if the use has a back object the item is not taken
    res.status(200).json({
      taken: false,
    });
  });

  // take an item
  router.post("/material/items/take/:code", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and at least a technician
    if (
      !req.auth?.user ||
      (req.auth?.user.permissionLevel != "technician" &&
        req.auth?.user.permissionLevel != "admin")
    ) {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the code is valid
    if (!req.params.code) {
      res.status(400).send("Bad Request");
      return;
    }

    // check if the item was already taken
    const use = await useCollection.findOne(
      { code: req.params.code },
      { sort: { _id: -1 } }
    );

    // if the item was already taken, return an error
    if (use && !use.back) {
      res.status(409).json({
        error: "Item already taken",
      });
      return;
    }

    // create a new use object
    const newUse: Use = {
      item_code: req.params.code,
      take: {
        time: Date.now(),
        checklist: req.body.checklist,
        user_id: req.auth?.user._id,
      },
      back: undefined,
    };

    // insert the use object into the database
    await useCollection.insertOne(newUse);

    res.status(200).json({
      message: "Item taken",
      use: newUse,
    });
  });

  // back an item
  router.post("/material/items/back/:code", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and at least a technician
    if (
      !req.auth?.user ||
      (req.auth?.user.permissionLevel != "technician" &&
        req.auth?.user.permissionLevel != "admin")
    ) {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the code is valid
    if (!req.params.code) {
      res.status(400).send("Bad Request");
      return;
    }

    // check if the item was already taken
    const use = await useCollection.findOne(
      { code: req.params.code },
      { sort: { _id: -1 } }
    );

    // if the item was not taken, return an error
    if (!use || !use.back) {
      res.status(409).json({
        error: "Item not taken",
      });
      return;
    }

    // update the use object with the back object
    await useCollection.updateOne(
      { _id: use._id },
      {
        $set: {
          back: {
            time: new Date().getTime(),
            checklist: req.body.checklist,
          },
        },
      }
    );

    res.status(200).json({
      message: "Item back",
    });
  });

  return router;
}
