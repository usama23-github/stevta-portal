import express from "express";
import { allStaff } from "./staff.controller.js";

const router = express.Router();

router.get("/", allStaff);

export default router;