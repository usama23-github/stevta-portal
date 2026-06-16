import express from 'express';
import { createAttendance, generateAttendance, getAttendanceLogs } from './attendance.controller.js';

const router = express.Router();

router.post('/save', createAttendance);
router.post("/generate", generateAttendance);
router.get("/logs", getAttendanceLogs);

export default router;