import { config as dotenv } from "dotenv";
dotenv();

import express from "express";
import cookieParser from "cookie-parser";
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
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // todo add routes

    app.use(express.static("public"));

    app.listen(process.env.PORT ?? 3000, () => {
        console.log("INFO", `Server runs on localhost:${process.env.PORT}`);
    });
};

void main();
