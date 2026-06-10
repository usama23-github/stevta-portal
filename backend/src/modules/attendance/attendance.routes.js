import express from 'express';
import { createAttendance } from './attendance.controller.js';

const router = express.Router();

router.post('/', createAttendance);

export default router;