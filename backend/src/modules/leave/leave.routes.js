import express from "express";

import {
    createLeaveType,
    getAllLeaveTypes,
    markLeave,
    getLeavesController,
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

router.get(
    "/",
    getLeavesController
);

// GET /api/leave/types
router.get(
    "/types",
    getAllLeaveTypes
);

export default router;