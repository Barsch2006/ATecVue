import { Router } from "express";
import { Db } from "mongodb";
import IItem from "./types/item";
import { Use } from "./types/use";

export default function takeMaterial(db: Db): Router {
  const router = Router();

  const itemCollection = db.collection<IItem>("items");
  const useCollection = db.collection<Use>("use");

  return router;
}
