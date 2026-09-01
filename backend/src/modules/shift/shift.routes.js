import express from "express";

import {
    createShift,
} from "./shift.controller.js";

const router = express.Router();

router.post("/", createShift);

export default router;