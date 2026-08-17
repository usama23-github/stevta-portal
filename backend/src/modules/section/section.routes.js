import express from "express";
import {
    getAllSections,
    updateSectionDepartment,
    updateSectionName,
    getSectionsByDepartmentId
} from "./section.controller.js";

const router = express.Router();

router.get("/", getAllSections);
router.get(
    "/department/:departmentId",
    getSectionsByDepartmentId
);

router.patch(
    "/:sectionId/department",
    updateSectionDepartment
);
router.patch(
    "/:sectionId/name",
    updateSectionName
);

export default router;