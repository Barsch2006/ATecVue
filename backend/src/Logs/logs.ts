// import { Db } from "mongodb";
// import ILog from "./log";
// import { Router } from "express";

// // return a router with the event create route
// export default function createEvent(db: Db): Router {

//     const router = Router();

//     const logCollection = db.collection<ILog>("logs");

//     router.post("/checkin", async (req, res) => {

//         if (!req.auth?.authenticated) {
//             res.status(401).send("Unauthorized");
//             return;
//         }

//         if (!validateBody(req.body)) {
//             res.status(400).send("Bad Request");
//             return;
//         }

//         const dbResult = await logCollection.insertOne({
//             name: req.body.name,
//             time: req.body.time,
//             text: req.body.text,
//             type: "CheckIn",
//             usageAula: req.body.usageAula,
//             usageRegie: req.body.usageRegie,
//             usageBackstage: req.body.usageBackstage,
//             usageStage: req.body.usageStage,
//             usageMobile: req.body.usageMobile,
//             aulaClosed: req.body.aulaClosed,
//             emergencyExitsClosed: req.body.emergencyExitsClosed,
//             regieClosed: req.body.regieClosed,
//             beamerOff: req.body.beamerOff,
//             lightsOff: req.body.lightsOff,
//             curtainOpen: req.body.curtainOpen,
//             canvasHidden: req.body.canvasHidden,
//             mainOff: req.body.mainOff,
//             anlageOff: req.body.anlageOff,
//             aulaClean: req.body.aulaClean,
//         });
//     })

//     return router;

// }

// function validateBody(body: any): body is ILog {
//     if (!body) return false;
//     if (body.name == undefined || typeof body.name !== "string") return false;
//     if (body.time == undefined || typeof body.time !== "number") return false;
//     if (body.text == undefined || typeof body.text !== "string") return false;
//     if (body.type == undefined || (body.type !== "CheckIn" && body.type !== "CheckOut")) return false;

//     if (body.usageAula == undefined || typeof body.usageAula !== "boolean") return false;
//     if (body.usageRegie == undefined || typeof body.usageRegie !== "boolean") return false;
//     if (body.usageBackstage == undefined || typeof body.usageBackstage !== "boolean") return false;
//     if (body.usageStage == undefined || typeof body.usageStage !== "boolean") return false;
//     if (body.usageMobile == undefined || typeof body.usageMobile !== "boolean") return false;

//     if (body.aulaClosed !== undefined && typeof body.aulaClosed !== "boolean") return false;
//     if (body.emergencyExitsClosed !== undefined && typeof body.emergencyExitsClosed !== "boolean") return false;
//     if (body.regieClosed !== undefined && typeof body.regieClosed !== "boolean") return false;
//     if (body.backstageClosed !== undefined && typeof body.backstageClosed !== "boolean") return false;
//     if (body.beamerOff !== undefined && typeof body.beamerOff !== "boolean") return false;
//     if (body.lightsOff !== undefined && typeof body.lightsOff !== "boolean") return false;
//     if (body.curtainOpen !== undefined && typeof body.curtainOpen !== "boolean") return false;
//     if (body.canvasHidden !== undefined && typeof body.canvasHidden !== "boolean") return false;
//     if (body.mainOff !== undefined && typeof body.mainOff !== "boolean") return false;
//     if (body.anlageOff !== undefined && typeof body.anlageOff !== "boolean") return false;
//     if (body.iPadCharging !== undefined && typeof body.iPadCharging !== "boolean") return false;
//     if (body.laptopCharing !== undefined && typeof body.laptopCharing !== "boolean") return false;
//     if (body.cabelNice !== undefined && typeof body.cabelNice !== "boolean") return false;
//     if (body.aulaClean !== undefined && typeof body.aulaClean !== "boolean") return false;
//     if (body.notes !== undefined && typeof body.notes !== "string") return false;
//     return true;
// }
