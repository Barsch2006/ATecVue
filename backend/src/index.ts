import { config as dotenv } from "dotenv";
dotenv();

import IEvent from "event";

import express from "express";
import cookieParser from "cookie-parser";
import IUser from "user";
import { compare } from "bcrypt";
const app = express();

if (!process.env.DB_URL) {
    throw new Error("ENV: DB_URL is missing!");
}
if (!process.env.DB_NAME) {
    console.warn("! WARN ! ENV: DB_NAME is missing. 'Dolphin' is used!");
}
if (!process.env.PORT) {
    console.warn("! WARN ! ENV: PORT is missing. 3000 is used!");
}

async function main() {
    // init mongodb
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.DB_URL ?? 'mongodb://localhost:27017');
    await client.connect();
    const db = client.db(process.env.DB_NAME ?? "ATec");

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.post('/createevent', async (req, res) => {
        const body = req.body as IEvent;
        if (!body) {
            res.status(400).send("Bad Request");
            return;
        }
        await db.collection("events").insertOne(body);
        res.status(200).send("OK");
    });

    app.post('/login', async (req, res) => {
        // get the user by the email 
        const email = req.body.email;
        const user = await db.collection("users").findOne({ email: email }) as IUser | null;
        if (!user) {
            res.status(400).send("Bad Request");
            return;
        }
        // compare bcrypt hash
        if (await compare(user.password, req.body.password)) {
            // todo set cookie
        } else {
            res.status(400).send("Bad Request");
            return;
        }
    });

    app.use(express.static("public"));

    app.listen(process.env.PORT ?? 3000, () => {
        console.log("INFO", `Server runs on localhost:${process.env.PORT}`);
    });
};

void main();
