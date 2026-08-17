import express from "express";

import {
    createDepartment,
    getAllDepartments
} from "./department.controller.js";

const router = express.Router();

router.post("/", createDepartment);
router.get("/", getAllDepartments);

export default router;