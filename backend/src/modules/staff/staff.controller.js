import { getAllStaff } from "./staff.service.js";

export const allStaff = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", sort = "desc" } = req.query;

        const result = await getAllStaff({ page, limit, search, sort });

        return res.json({
            result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch staff" });
    }
};