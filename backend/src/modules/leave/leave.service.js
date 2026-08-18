import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

const prisma = new PrismaClient();

// ========================================
// COMPRESS PDF
// ========================================

const compressPdf = async (buffer) => {
    const pdfDoc =
        await PDFDocument.load(buffer);

    // Re-save PDF to remove unnecessary
    // document data where possible.
    const compressedBytes =
        await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
        });

    return Buffer.from(compressedBytes);
};

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

export const getAllLeaveTypesService = async ({
    page = 1,
    limit = 10,
    search = "",
    sortField = "name",
    sortOrder = "asc",
}) => {

    // ----------------------------------------
    // Convert pagination values to integers
    // ----------------------------------------

    page = parseInt(page);
    limit = parseInt(limit);

    // Prevent invalid values
    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 10;
    }

    // Optional maximum limit
    if (limit > 100) {
        limit = 100;
    }

    // ----------------------------------------
    // Calculate skip
    // ----------------------------------------

    const skip = (page - 1) * limit;


    // ----------------------------------------
    // WHERE condition
    // ----------------------------------------

    const where = {};

    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive",
        };
    }


    // ----------------------------------------
    // Allowed sort fields
    // ----------------------------------------

    const allowedSortFields = [
        "id",
        "name",
        "createdAt",
        "updatedAt",
    ];

    if (!allowedSortFields.includes(sortField)) {
        sortField = "name";
    }


    // ----------------------------------------
    // Sort order
    // ----------------------------------------

    sortOrder =
        sortOrder.toLowerCase() === "desc"
            ? "desc"
            : "asc";


    // ----------------------------------------
    // Get total + data
    // ----------------------------------------

    const [total, data] =
        await Promise.all([

            prisma.leaveType.count({
                where,
            }),

            prisma.leaveType.findMany({
                where,

                skip,

                take: limit,

                orderBy: {
                    [sortField]: sortOrder,
                },
            }),

        ]);


    // ----------------------------------------
    // Return data + meta
    // ----------------------------------------

    return {
        data,

        meta: {
            total,

            page,

            limit,

            totalPages:
                Math.ceil(total / limit),

            sortField,

            sortOrder,
        },
    };
};

// ========================================
// MARK LEAVE
// ========================================

export const markLeaveService = async ({
    staffId,
    leaveTypeId,
    fromDate,
    toDate,
    reason,
    remarks,
    createdById,
    notification,
}) => {

    // ========================================
    // VALIDATE STAFF
    // ========================================

    const staff = await prisma.staff.findUnique({
        where: {
            id: staffId,
        },

        select: {
            id: true,
            empNo: true,
            name: true,
            postingPlaceId: true,
            sectionId: true,
            designationId: true,
        },
    });

    if (!staff) {
        const error = new Error(
            "Employee not found."
        );

        error.statusCode = 404;

        throw error;
    }


    // ========================================
    // VALIDATE LEAVE TYPE
    // ========================================

    const leaveType =
        await prisma.leaveType.findUnique({
            where: {
                id: Number(leaveTypeId),
            },
        });

    if (!leaveType) {
        const error = new Error(
            "Leave type not found."
        );

        error.statusCode = 404;

        throw error;
    }


    // ========================================
    // VALIDATE DATES
    // ========================================

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        const error = new Error(
            "Invalid leave dates."
        );

        error.statusCode = 400;

        throw error;
    }


    if (startDate > endDate) {
        const error = new Error(
            "From date cannot be greater than to date."
        );

        error.statusCode = 400;

        throw error;
    }


    // ========================================
    // NORMALIZE DATES
    // ========================================

    startDate.setHours(
        0,
        0,
        0,
        0
    );

    endDate.setHours(
        23,
        59,
        59,
        999
    );


    // ========================================
    // CALCULATE TOTAL DAYS
    // ========================================

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    const totalDays =
        Math.floor(
            (endDate.getTime() -
                startDate.getTime()) /
            millisecondsPerDay
        ) + 1;


    // ========================================
    // CASUAL LEAVE RULES
    // ========================================

    // const isCasualLeave =
    //     leaveType.name
    //         .trim()
    //         .toLowerCase() ===
    //     "casual leave";


    // if (isCasualLeave) {

    //     // --------------------------------------
    //     // ONLY ONE DAY
    //     // --------------------------------------

    //     if (totalDays !== 1) {

    //         const error = new Error(
    //             "Casual Leave can only be marked for one day at a time."
    //         );

    //         error.statusCode = 400;

    //         throw error;
    //     }


    //     // --------------------------------------
    //     // CURRENT YEAR
    //     // --------------------------------------

    //     const year =
    //         startDate.getFullYear();


    //     const yearStart =
    //         new Date(
    //             year,
    //             0,
    //             1,
    //             0,
    //             0,
    //             0,
    //             0
    //         );


    //     const yearEnd =
    //         new Date(
    //             year,
    //             11,
    //             31,
    //             23,
    //             59,
    //             59,
    //             999
    //         );


    //     // --------------------------------------
    //     // USED CASUAL LEAVES
    //     // --------------------------------------

    //     const usedCasualLeaves =
    //         await prisma.leave.aggregate({
    //             where: {
    //                 staffId: staff.id,

    //                 leaveTypeId:
    //                     leaveType.id,

    //                 fromDate: {
    //                     gte: yearStart,
    //                     lte: yearEnd,
    //                 },
    //             },

    //             _sum: {
    //                 totalDays: true,
    //             },
    //         });


    //     const usedDays =
    //         Number(
    //             usedCasualLeaves._sum.totalDays
    //         ) || 0;


    //     const allowedDays = 24;


    //     // --------------------------------------
    //     // ALL 24 USED
    //     // --------------------------------------

    //     if (usedDays >= allowedDays) {

    //         const error = new Error(
    //             `Employee has already used all ${allowedDays} Casual Leave days for ${year}.`
    //         );

    //         error.statusCode = 400;

    //         throw error;
    //     }


    //     // --------------------------------------
    //     // EXCEEDS LIMIT
    //     // --------------------------------------

    //     if (
    //         usedDays + totalDays >
    //         allowedDays
    //     ) {

    //         const remaining =
    //             allowedDays - usedDays;

    //         const error = new Error(
    //             `Only ${remaining} Casual Leave day(s) remaining for ${year}.`
    //         );

    //         error.statusCode = 400;

    //         throw error;
    //     }
    // }


    // ========================================
    // CHECK OVERLAPPING LEAVE
    // ========================================

    const existingLeave =
        await prisma.leave.findFirst({
            where: {
                staffId: staff.id,

                AND: [
                    {
                        fromDate: {
                            lte: endDate,
                        },
                    },

                    {
                        toDate: {
                            gte: startDate,
                        },
                    },
                ],
            },
        });


    if (existingLeave) {

        const error = new Error(
            "Employee already has leave during the selected dates."
        );

        error.statusCode = 409;

        throw error;
    }


    // ========================================
    // PDF FILE
    // ========================================

    let savedFilePath = null;

    let savedFileName = null;


    try {

        // ======================================
        // COMPRESS PDF
        // ======================================

        let compressedPdf = null;

        if (notification) {

            compressedPdf =
                await compressPdf(
                    notification.buffer
                );
        }


        // ======================================
        // TRANSACTION
        // ======================================

        const result =
            await prisma.$transaction(
                async (tx) => {

                    // --------------------------------
                    // DELETE ATTENDANCE IF EXISTS
                    // --------------------------------

                    const deletedAttendance =
                        await tx.attendance.deleteMany({
                            where: {

                                empNo:
                                    staff.empNo,

                                attendanceDate: {
                                    gte: startDate,
                                    lte: endDate,
                                },

                            },
                        });


                    // --------------------------------
                    // CREATE LEAVE
                    // --------------------------------

                    const leave =
                        await tx.leave.create({
                            data: {

                                staffId:
                                    staff.id,

                                postingPlaceId:
                                    staff.postingPlaceId,

                                designationId:
                                    staff.designationId,

                                sectionId:
                                    staff.sectionId,

                                leaveTypeId:
                                    leaveType.id,

                                fromDate:
                                    startDate,

                                toDate:
                                    endDate,

                                totalDays,

                                reason:
                                    reason?.trim() ||
                                    null,

                                remarks:
                                    remarks?.trim() ||
                                    null,

                                createdById:
                                    createdById ||
                                    null,

                            },

                            include: {

                                staff: {
                                    select: {
                                        id: true,
                                        empNo: true,
                                        name: true,
                                    },
                                },

                                leaveType: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },

                                postingPlace: {
                                    select: {
                                        id: true,
                                        postingPlace: true,
                                    },
                                },

                                designation: {
                                    select: {
                                        id: true,
                                        designation: true,
                                    },
                                },

                                section: {
                                    select: {
                                        id: true,
                                        section: true,
                                    },
                                },

                            },
                        });


                    // --------------------------------
                    // SAVE PDF
                    // --------------------------------

                    if (compressedPdf) {

                        const uploadDir =
                            path.join(
                                process.cwd(),
                                "uploads",
                                "leaves"
                            );


                        await fs.mkdir(
                            uploadDir,
                            {
                                recursive: true,
                            }
                        );


                        const uniqueName =
                            `${leave.id}-${Date.now()}.pdf`;


                        const fullPath =
                            path.join(
                                uploadDir,
                                uniqueName
                            );


                        await fs.writeFile(
                            fullPath,
                            compressedPdf
                        );


                        savedFilePath =
                            `uploads/leaves/${uniqueName}`;

                        savedFileName =
                            notification.originalname;


                        // ------------------------------
                        // CREATE DOCUMENT RECORD
                        // ------------------------------

                        await tx.leaveDocument.create({
                            data: {

                                leaveId:
                                    leave.id,

                                fileName:
                                    savedFileName,

                                filePath:
                                    savedFilePath,

                            },
                        });
                    }


                    return {
                        leave,

                        deletedAttendanceCount:
                            deletedAttendance.count,

                        notificationAttached:
                            Boolean(compressedPdf),
                    };
                }
            );


        return result;

    } catch (error) {

        // ======================================
        // CLEANUP FILE IF DB FAILED
        // ======================================

        if (savedFilePath) {

            try {

                const fullPath =
                    path.join(
                        process.cwd(),
                        savedFilePath
                    );

                await fs.unlink(
                    fullPath
                );

            } catch (cleanupError) {

                console.error(
                    "PDF cleanup failed:",
                    cleanupError
                );
            }
        }


        throw error;
    }
};

export const getLeaves = async ({
    page = 1,
    limit = 10,
    search = "",
    staffId,
    leaveTypeId,
    postingPlaceId,
    regionId,
    designationId,
    sectionId,
    fromDate,
    toDate,
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    // Employee
    if (staffId) {
        where.staffId = staffId;
    }

    // Leave type
    if (leaveTypeId) {
        where.leaveTypeId = Number(leaveTypeId);
    }

    // Posting place
    if (postingPlaceId) {
        where.postingPlaceId = Number(postingPlaceId);
    }

    // Region
    if (regionId) {
        where.regionId = Number(regionId);
    }

    // Designation
    if (designationId) {
        where.designationId = Number(designationId);
    }

    // Section
    if (sectionId) {
        where.sectionId = Number(sectionId);
    }

    // Search employee by name or employee number
    if (search) {
        where.staff = {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    empNo: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        };
    }

    // Date range
    if (fromDate || toDate) {
        where.fromDate = {};

        if (fromDate) {
            where.fromDate.gte = new Date(fromDate);
        }

        if (toDate) {
            where.fromDate.lte = new Date(toDate);
        }
    }

    const [leaves, total] = await Promise.all([
        prisma.leave.findMany({
            where,
            skip,
            take: limit,

            orderBy: {
                createdAt: "desc",
            },

            include: {
                staff: {
                    select: {
                        id: true,
                        empNo: true,
                        name: true,
                        department: true,

                        designation: {
                            select: {
                                id: true,
                                designation: true,
                            },
                        },

                        postingPlace: {
                            select: {
                                id: true,
                                postingPlace: true,
                            },
                        },

                        section: {
                            select: {
                                id: true,
                                section: true,
                            },
                        },
                    },
                },

                leaveType: {
                    select: {
                        id: true,
                        leaveType: true,
                    },
                },

                postingPlace: {
                    select: {
                        id: true,
                        postingPlace: true,
                    },
                },

                region: {
                    select: {
                        id: true,
                        region: true,
                    },
                },

                designation: {
                    select: {
                        id: true,
                        designation: true,
                    },
                },

                section: {
                    select: {
                        id: true,
                        section: true,
                    },
                },

                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                documents: {
                    select: {
                        id: true,
                        fileName: true,
                        filePath: true,
                        uploadedAt: true,
                    },
                },
            },
        }),

        prisma.leave.count({
            where,
        }),
    ]);

    return {
        data: leaves,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};