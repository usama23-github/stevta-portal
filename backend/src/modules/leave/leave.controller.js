import {
    createLeaveTypeService,
    getAllLeaveTypesService,
    markLeaveService,
} from "./leave.service.js";


// ========================================
// CREATE LEAVE TYPE
// ========================================

export const createLeaveType = async (
    req,
    res
) => {
    try {

        const { name } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Leave type name is required.",
            });
        }

        const leaveType =
            await createLeaveTypeService(name);

        return res.status(201).json({
            success: true,
            message:
                "Leave type created successfully.",
            data: leaveType,
        });

    } catch (error) {

        console.error(
            "Create Leave Type Error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to create leave type.",
        });
    }
};


// ========================================
// GET ALL LEAVE TYPES
// ========================================

export const getAllLeaveTypes = async (
    req,
    res
) => {
    try {

        const {
            page = 1,
            limit = 10,
            search = "",
            sortField = "name",
            sortOrder = "asc",
        } = req.query;


        const result =
            await getAllLeaveTypesService({
                page,
                limit,
                search,
                sortField,
                sortOrder,
            });


        return res.status(200).json({
            success: true,

            message:
                "Leave types fetched successfully.",

            data: result.data,

            meta: result.meta,
        });

    } catch (error) {

        console.error(
            "Get Leave Types Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch leave types.",
        });
    }
};

// ========================================
// MARK LEAVE
// ========================================

export const markLeave = async (
    req,
    res
) => {

    try {

        const {
            staffId,
            leaveTypeId,
            fromDate,
            toDate,
            reason,
            remarks,
        } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (!staffId) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee is required.",
            });
        }


        if (!leaveTypeId) {
            return res.status(400).json({
                success: false,
                message:
                    "Leave type is required.",
            });
        }


        if (!fromDate) {
            return res.status(400).json({
                success: false,
                message:
                    "From date is required.",
            });
        }


        if (!toDate) {
            return res.status(400).json({
                success: false,
                message:
                    "To date is required.",
            });
        }


        // ======================================
        // CREATED BY
        // ======================================

        const createdById =
            req.user?.id || null;


        // ======================================
        // MARK LEAVE
        // ======================================

        const result =
            await markLeaveService({

                staffId,

                leaveTypeId,

                fromDate,

                toDate,

                reason,

                remarks,

                createdById,

                notification:
                    req.file || null,

            });


        // ======================================
        // RESPONSE
        // ======================================

        return res.status(201).json({

            success: true,

            message:
                "Leave marked successfully.",

            data: result,

        });

    } catch (error) {

        console.error(
            "Mark Leave Error:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Failed to mark leave.",

        });
    }
};