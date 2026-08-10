import {
  getAttendanceDashboard,
} from "./dashboard.service.js";

export const attendanceDashboard = async (
  req,
  res
) => {
  try {
    const { date } = req.query;

    const data =
      await getAttendanceDashboard(
        date || new Date()
      );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(
      "Attendance Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load attendance dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};