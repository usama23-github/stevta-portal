import express from "express";

import {
    createScale,
    getAllScales
} from "./scale.controller.js";

const router = express.Router();

router.post("/", createScale);
router.get("/", getAllScales);

export default router;