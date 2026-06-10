import express from 'express';
import { createAttendance } from './attendance.controller.js';

const router = express.Router();

router.post('/save', createAttendance);

export default router;