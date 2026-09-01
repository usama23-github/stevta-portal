import express from "express";

import {
    createShift,
    deleteShiftTiming,
    getAllShiftTimings,
} from "./shift.controller.js";

const router = express.Router();

router.post("/", createShift);

router.get("/timings", getAllShiftTimings);

router.delete("/timings/:timingId", deleteShiftTiming);

export default router;