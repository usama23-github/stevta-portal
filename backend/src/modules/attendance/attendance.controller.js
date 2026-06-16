import {
    saveAttendance,
    createAttendanceLog,
    generateAttendanceService,
    getAttendanceLogsService
} from "./attendance.service.js";

export const createAttendance = async (req, res, next) => {
    try {
        const attendance = await saveAttendance(req.body);

        const log = await createAttendanceLog(req.body);

        return res.status(201).json({
            success: true,
            attendance,
            log,
        });
    } catch (error) {
        next(error);
    }
};

export const generateAttendance = async (
    req,
    res,
    next
) => {
    try {
        const { date } = req.body;

        const result =
            await generateAttendanceService(date);

        return res.status(200).json({
            success: true,
            message:
                "Attendance generated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAttendanceLogs = async (
    req,
    res,
    next
) => {
    try {
        const { date } = req.query;

        const logs =
            await getAttendanceLogsService(date);

        return res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};