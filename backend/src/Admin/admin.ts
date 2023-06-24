import { Db } from "mongodb";
import IUser from "../Auth/user";
import { Router } from "express";

// return a router with the event create route
export default function createEvent(db: Db): Router {

    const router = Router();

    const userCollection = db.collection<IUser>("users");

    // todo

    return router;

}
