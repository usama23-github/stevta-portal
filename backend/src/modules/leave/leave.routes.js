import express from "express";

import {
    createLeaveType,
    getAllLeaveTypes,
    markLeave,
} from "./leave.controller.js";

import {
    uploadLeaveNotification,
} from "./leave.middleware.js";

const router = express.Router();

// ========================================
// MARK LEAVE
// ========================================

router.post(
    "/",
    uploadLeaveNotification,
    markLeave
);


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