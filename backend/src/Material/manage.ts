import { Router } from "express";
import { Db } from "mongodb";
import IItem from "./types/item";

export default function manageMaterial(db: Db): Router {
  const router = Router();

  const itemCollection = db.collection<IItem>("items");

  router.post("/material/items/create", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and a admin
    if (!req.auth?.user || req.auth?.user.permissionLevel != "admin") {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the request body is valid
    if (
      !req.body.name ||
      !req.body.condition ||
      !req.body.take_checklist ||
      !req.body.back_checklist ||
      !req.body.location ||
      !req.body.category
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    // check if the category is valid
    if (
      req.body.category !== "cabel" &&
      req.body.category !== "adapter" &&
      req.body.category !== "sound" &&
      req.body.category !== "light" &&
      req.body.category !== "other"
    ) {
      res.status(404).json({
        error: "Category not found",
      });
      return;
    }

    // create a code for the item based on the category. The code is the first letter of the category and a 7 digit number
    let code = "";
    let item: IItem | null = null;
    do {
      switch (req.body.category) {
        case "cabel":
          code = "C";
          break;
        case "adapter":
          code = "A";
          break;
        case "sound":
          code = "S";
          break;
        case "light":
          code = "L";
          break;
        case "other":
          code = "O";
          break;
      }
      // generate a random 7 digit number
      const random = Math.floor(1000000 + Math.random() * 9000000);
      code += random.toString();

      // check if the code is already in use
      item = await itemCollection.findOne({
        code: code,
      });
    } while (item);

    // create the item
    const newItem: IItem = {
      name: req.body.name,
      condition: req.body.condition,
      take_checklist: req.body.take_checklist,
      back_checklist: req.body.back_checklist,
      location: req.body.location,
      category: req.body.category,
      code: code,
    };

    // insert the item into the database
    await itemCollection.insertOne(newItem);

    res.status(200).json({
      message: "Item created",
      item: newItem,
    });
  });

  router.post("/material/items/update", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and a admin
    if (!req.auth?.user || req.auth?.user.permissionLevel != "admin") {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the request body is valid
    if (
      !req.body.name ||
      !req.body.condition ||
      !req.body.take_checklist ||
      !req.body.back_checklist ||
      !req.body.location ||
      !req.body.category ||
      !req.body.code
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    // check if the category is valid
    if (
      req.body.category !== "cabel" &&
      req.body.category !== "adapter" &&
      req.body.category !== "sound" &&
      req.body.category !== "light" &&
      req.body.category !== "other"
    ) {
      res.status(404).json({
        error: "Category not found",
      });
      return;
    }

    // check if the item exists
    const item = await itemCollection.findOne({
      code: req.body.code,
    });

    if (!item) {
      res.status(404).json({
        error: "Item not found",
      });
      return;
    }

    // update the item
    const newItem: IItem = {
      name: req.body.name,
      condition: req.body.condition,
      take_checklist: req.body.take_checklist,
      back_checklist: req.body.back_checklist,
      location: req.body.location,
      category: req.body.category,
      code: req.body.code,
    };

    // update the item in the database
    await itemCollection.updateOne(
      {
        code: req.body.code,
      },
      {
        $set: newItem,
      }
    );

    res.status(200).send("Item updated");
  });

  router.delete("/material/items/delete/:code", async (req, res) => {
    if (!req.auth?.authenticated) {
      res.status(401).send("Unauthorized");
      return;
    }

    // check if the user is logged in and a admin
    if (!req.auth?.user || req.auth?.user.permissionLevel != "admin") {
      res.status(403).send("Forbidden");
      return;
    }

    // check if the code is valid
    if (!req.params.code) {
      res.status(400).send("Bad Request");
      return;
    }

    // check if the item exists
    const item = await itemCollection.findOne({
      code: req.params.code,
    });

    if (!item) {
      res.status(404).json({
        error: "Item not found",
      });
      return;
    }

    // delete the item
    await itemCollection.deleteOne({
      code: req.params.code,
    });

    res.status(200).send("Item deleted");
  });

  return router;
}
