import {
    createDepartmentService,
    getAllDepartmentsService
} from "./department.service.js";

export const createDepartment = async (req, res, next) => {
    try {
        const department = await createDepartmentService(req.body);

        return res.status(201).json({
            success: true,
            message: "Department registered successfully",
            data: department,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllDepartments = async (
    req,
    res,
    next
) => {
    try {
        const result = await getAllDepartmentsService(req.query);

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        next(error);
    }
};