import {
    createShiftService,
} from "./shift.service.js";

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