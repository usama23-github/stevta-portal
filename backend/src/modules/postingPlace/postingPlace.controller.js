import { createPostingPlaceService, getAllPostingPlaceService } from "./postingPlace.service.js";

export const createPostingPlace = async (req, res, next) => {
    try {
        const postingPlace = await createPostingPlaceService(req.body);

        return res.status(201).json({
            success: true,
            message: "Posting Place registered successfully",
            data: postingPlace,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPostingPlaces = async (req, res, next) => {
    try {
        const result = await getAllPostingPlaceService();

        return res.json({
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch staff" });
    }
};