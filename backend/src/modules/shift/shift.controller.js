import {
    createShiftService,
    deleteShiftTimingService,
    getAllShiftTimingsService,
} from "./shift.service.js"

export const createShift = async (req, res) => {
    try {
        const shift = await createShiftService(req.body);

        return res.status(201).json({
            success: true,
            message: "Shift created successfully",
            data: shift,
        });
    } catch (error) {
        console.error("Create shift error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteShiftTiming = async (req, res) => {
    try {
        const { timingId } = req.params;

        const result = await deleteShiftTimingService(timingId);

        return res.status(200).json({
            success: true,
            message: "Shift timing deleted successfully",
            data: result,
        });
    } catch (error) {
        console.error("Delete shift timing error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllShiftTimings = async (req, res) => {
    try {
        const timings = await getAllShiftTimingsService();

        return res.status(200).json({
            success: true,
            message: "Shift timings fetched successfully",
            data: timings,
        });
    } catch (error) {
        console.error("Get all shift timings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch shift timings",
            error: error.message,
        });
    }
};