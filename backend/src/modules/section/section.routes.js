import express from "express";
import {
    getAllSections,
    updateSectionDepartment
} from "./section.controller.js";

const router = express.Router();

router.get("/", getAllSections);

router.patch(
    "/:sectionId/department",
    updateSectionDepartment
);

export default router;