import express from "express";
import { getAllDesignations } from "./designation.controller.js";

const router = express.Router();

router.get("/", getAllDesignations);

export default router;