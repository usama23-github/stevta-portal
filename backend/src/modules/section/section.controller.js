import { getAllSectionsService } from "./section.service.js";

export const getAllSections = async (
    req,
    res,
    next
) => {
    try {
        const result = await getAllSectionsService(req.query);

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        next(error);
    }
};