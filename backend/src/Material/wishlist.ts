import { Router } from "express";
import { Db, ObjectId } from "mongodb";

interface IWishlistItem {
  name: string;
  description: string;
  price: number;
  url: string;
  amount: number;
  status: "bought" | "accepted" | "pending" | "rejected";
}

export default function wishlist(db: Db): Router {
  const router = Router();

  const wishlistCollection = db.collection<IWishlistItem>("wishlist");

  router.get("/wishlist/items", async (req, res) => {
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

    const wishlist = await wishlistCollection.find().toArray();
    res.json(wishlist);
  });

  router.post("/wishlist/items", async (req, res) => {
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

    // check if the request body is valid
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      !req.body.url ||
      !req.body.amount
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    const wishlistItem: IWishlistItem = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      url: req.body.url,
      amount: req.body.amount,
      status: "pending",
    };

    await wishlistCollection.insertOne(wishlistItem);
    res.status(200).send("OK");
  });

  router.put("/wishlist/items/:id", async (req, res) => {
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
      !req.body.description ||
      !req.body.price ||
      !req.body.url ||
      !req.body.amount ||
      !req.body.status
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    const wishlistItem: IWishlistItem = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      url: req.body.url,
      amount: req.body.amount,
      status: req.body.status,
    };

    await wishlistCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: wishlistItem }
    );

    res.status(200).send("OK");
  });

  return router;
}
