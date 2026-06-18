import express from 'express';
import {
    createAttendance,
    generateAttendance,
    getAttendanceLogs,
    getStaffAttendance,
    deleteAllAttendance
} from './attendance.controller.js';

const router = express.Router();

router.post('/save', createAttendance);
router.post("/generate", generateAttendance);
router.get("/logs", getAttendanceLogs);
router.delete("/all", deleteAllAttendance);
router.get("/", getStaffAttendance);

export default router;