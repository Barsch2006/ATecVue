import { config as dotenv } from "dotenv";
dotenv();

import express from "express";
import cookieParser from "cookie-parser";
import auth from "Auth/auth";
import createEvent from "Event/create";
const app = express();

async function main() {
    if (!process.env.DB_URL) {
        throw new Error("ENV: DB_URL is missing!");
    }
    if (!process.env.DB_NAME) {
        console.warn("! WARN ! ENV: DB_NAME is missing. 'ATec' is being used!");
    }
    if (!process.env.PORT) {
        console.warn("! WARN ! ENV: PORT is missing. 3000 is being used!");
    }
    // init mongodb
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.DB_URL);
    await client.connect();
    const db = client.db(process.env.DB_NAME ?? "ATec");

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    auth(app, db);

    app.use(createEvent(db))

    app.use(express.static("public"));

    app.listen(process.env.PORT ?? 3000, () => {
        console.log("INFO", `Server runs on localhost:${process.env.PORT}`);
    });
};

main();
