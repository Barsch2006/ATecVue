import { Router } from "express";
import { Db, ObjectId } from "mongodb";
import IItem from "./types/item";

export default function getMaterial(db: Db): Router {
  const router = Router();

  const itemCollection = db.collection<IItem>("items");

  router.get("/material/items", async (_req, res) => {
    const items = await itemCollection.find().toArray();
    res.json(items);
  });

  router.get("/material/items/:id", async (req, res) => {
    const item = await itemCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!item) {
      res.status(404).json({
        error: "Item not found",
      });
      return;
    }

    res.json(item);
  });

  router.get("/material/items/:code", async (req, res) => {
    const item = await itemCollection.findOne({
      code: req.params.code,
    });

    if (!item) {
      res.status(404).json({
        error: "Item not found",
      });
      return;
    }

    res.json(item);
  });

  router.get("/material/items/:category", async (req, res) => {
    // check if category is valid
    if (
      req.params.category !== "cabel" &&
      req.params.category !== "adapter" &&
      req.params.category !== "sound" &&
      req.params.category !== "light" &&
      req.params.category !== "other"
    ) {
      res.status(404).json({
        error: "Category not found",
      });
      return;
    }

    const items = await itemCollection.find({
      category: req.params.category,
    });

    if (!items) {
      res.status(404).json({
        error: "Item not found",
      });
      return;
    }

    res.json(items);
  });

  return router;
}
