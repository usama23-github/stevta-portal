import express from "express";
import { getAllSections } from "./section.controller.js";

const router = express.Router();

router.get("/", getAllSections);

export default router;