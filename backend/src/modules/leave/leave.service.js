import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ========================================
// CREATE LEAVE TYPE
// ========================================

export const createLeaveTypeService = async (name) => {
    const leaveTypeName = name.trim();

    // Check duplicate
    const existingLeaveType =
        await prisma.leaveType.findUnique({
            where: {
                name: leaveTypeName,
            },
        });

    if (existingLeaveType) {
        const error = new Error(
            "Leave type already exists."
        );

        error.statusCode = 409;

        throw error;
    }

    const leaveType =
        await prisma.leaveType.create({
            data: {
                name: leaveTypeName,
            },
        });

    return leaveType;
};


// ========================================
// GET ALL LEAVE TYPES
// ========================================

export const getAllLeaveTypesService =
    async () => {

        const leaveTypes =
            await prisma.leaveType.findMany({
                orderBy: {
                    name: "asc",
                },
            });

        return leaveTypes;
    };