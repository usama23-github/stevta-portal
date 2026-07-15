import { createScaleService, getAllScalesService } from "./scale.service.js";

export const createScale = async (req, res, next) => {
    try {
        const scale = await createScaleService(req.body);

        return res.status(201).json({
            success: true,
            message: "Scale registered successfully",
            data: scale,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllScales = async (req, res, next) => {
    try {
        const result = await getAllScalesService();

        return res.json({
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch scales" });
    }
};