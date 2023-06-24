import { config as dotenv } from "dotenv";
dotenv();

import express from "express";
import cookieParser from "cookie-parser";
import auth from "Auth/auth";
import createEvent from "Event/create";
const app = express();

import ATecBot from "Bot/Bot";
import viewEvents from "Event/view";

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

    // discord bot
    if (!process.env.DISCORD_TOKEN) {
        throw new Error("ENV: DISCORD_TOKEN is missing!");
    }
    if (!process.env.DISCORD_APPLICATION_ID) {
        throw new Error("ENV: DISCORD_APPLICATION_ID is missing!");
    }
    if (!process.env.DISCORD_DEFAULT_CHANNEL) {
        throw new Error("ENV: DISCORD_DEFAULT_CHANNEL is missing!");
    }
    if (!process.env.DISCORD_EVENT_CHANNEL) {
        throw new Error("ENV: DISCORD_EVENT_CHANNEL is missing!");
    }

    const bot = new ATecBot(process.env.DISCORD_TOKEN, process.env.DISCORD_APPLICATION_ID, db, {
        default_channel: process.env.DISCORD_DEFAULT_CHANNEL ?? "",
        event_channel: process.env.DISCORD_EVENT_CHANNEL ?? "",
    });

    auth(app, db);

    app.use(createEvent(db));
    app.use(viewEvents(db));

    app.use(express.static("public"));

    app.listen(process.env.PORT ?? 3000, () => {
        console.log("INFO", `Server runs on localhost: ${process.env.PORT}`);
    });
};

main();
