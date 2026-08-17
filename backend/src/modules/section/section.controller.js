import {
    getAllSectionsService,
    updateSectionDepartmentService
} from "./section.service.js";

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

export const updateSectionDepartment = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { departmentId } = req.body;

        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Section ID is required",
            });
        }

        if (!departmentId) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required",
            });
        }

        const updatedSection = await updateSectionDepartmentService({
            sectionId,
            departmentId,
        });

        return res.status(200).json({
            success: true,
            message: "Section department updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Update section department error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update section department",
        });
    }
};