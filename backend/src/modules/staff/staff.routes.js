import express from "express";
import { allStaff, deleteAllStaff } from "./staff.controller.js";

const router = express.Router();

router.delete("/all", deleteAllStaff);
router.get("/", allStaff);

export default router;