import express from "express";
import { allStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/", allStaff);

export default router;