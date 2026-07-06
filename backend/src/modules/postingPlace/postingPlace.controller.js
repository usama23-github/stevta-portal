import { createPostingPlaceService } from "./postingPlace.service.js";

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