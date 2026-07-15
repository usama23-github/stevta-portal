import express from 'express';
import {
    createAttendance,
    generateAttendance,
    getAttendanceLogs,
    getStaffAttendance,
    deleteAllAttendance,
    getAttendanceReport,
    getAttendanceSummary,
} from './attendance.controller.js';

const router = express.Router();

router.post('/save', createAttendance);
router.post("/generate", generateAttendance);
router.get("/logs", getAttendanceLogs);
router.delete("/all", deleteAllAttendance);
router.get("/report", getAttendanceReport);
router.get("/summary", getAttendanceSummary);
router.get("/", getStaffAttendance);

export default router;