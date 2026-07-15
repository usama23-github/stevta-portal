import { getAllDesignationsService } from "./designation.service.js";

export const getAllDesignations = async (req, res, next) => {
    try {
        const result = await getAllDesignationsService(req.query);

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        next(error);
    }
};