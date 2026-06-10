import { saveAttendance } from './attendance.service.js';

export const createAttendance = async (req, res) => {
    try {
        const attendance = await saveAttendance(req.body);

        res.status(201).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};