import express from "express";

import {
    createShift,
    deleteShiftTiming,
} from "./shift.controller.js";

const router = express.Router();

router.post("/", createShift);

router.delete(
    "/timings/:timingId",
    deleteShiftTiming
);

export default router;