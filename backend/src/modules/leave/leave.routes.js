import express from "express";

import {
    createLeaveType,
    getAllLeaveTypes,
} from "./leave.controller.js";

const router = express.Router();


// ========================================
// LEAVE TYPES
// ========================================

// POST /api/leave/types
router.post(
    "/types",
    createLeaveType
);


// GET /api/leave/types
router.get(
    "/types",
    getAllLeaveTypes
);


export default router;