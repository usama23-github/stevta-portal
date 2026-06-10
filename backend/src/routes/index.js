import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);

export default router;