import {
  saveAttendance,
  createAttendanceLog,
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