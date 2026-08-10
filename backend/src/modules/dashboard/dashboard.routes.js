import express from "express";

import {
    attendanceDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
    "/",
    attendanceDashboard
);

export default router;