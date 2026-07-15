import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js";
import postingPlaceRoutes from "../modules/postingPlace/postingPlace.routes.js";
import scaleRoutes from "../modules/scale/scale.routes.js";
import importRoutes from "../modules/imports/import.routes.js";
import sectionRoutes from "../modules/section/section.routes.js";
import designationRoutes from "../modules/designation/designation.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/staff", staffRoutes);
router.use("/postingPlace", postingPlaceRoutes);
router.use("/scale", scaleRoutes);
router.use("/sections", sectionRoutes);
router.use("/designations", designationRoutes);
router.use("/imports", importRoutes);

export default router;