import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllStaff = async ({
    page = 1,
    limit = 10,
    search = "",
    sort = "asc",
    designationId,
    postingPlaceId,
    sectionId,
}) => {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
        where.OR = [
            {
                empNo: {
                    contains: search,
                },
            },
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                designation: {
                    is: {
                        designation: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            },
            {
                postingPlace: {
                    is: {
                        postingPlace: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            },
            {
                section: {
                    is: {
                        section: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            },
        ];
    }

    if (designationId) {
        where.designationId = Number(designationId);
    }

    if (postingPlaceId) {
        where.postingPlaceId = Number(postingPlaceId);
    }

    if (sectionId) {
        where.sectionId = Number(sectionId);
    }

    const [rows, total] = await Promise.all([
        prisma.staff.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                empNo: sort === "desc" ? "desc" : "asc",
            },
            include: {
                designation: {
                    select: {
                        designation: true,
                        scale: {
                            select: {
                                scale: true,
                            },
                        },
                    },
                },
                postingPlace: {
                    select: {
                        postingPlace: true,
                    },
                },
                section: {
                    select: {
                        section: true,
                    },
                },
            },
        }),

        prisma.staff.count({
            where,
        }),
    ]);

    const data = rows.map((staff) => ({
        id: staff.id,

        empNo: staff.empNo,

        employeeName: staff.name,

        designation: staff.designation
            ? `${staff.designation.designation} ${staff.designation.scale?.scale ?? ""
                }`.trim()
            : null,

        department: staff.department,

        postingPlace: staff.postingPlace?.postingPlace ?? null,

        section: staff.section?.section ?? null,

        createdAt: staff.createdAt,

        updatedAt: staff.updatedAt,
    }));

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const deleteAllStaffService =
    async (confirm) => {
        if (confirm !== "YES") {
            throw new Error(
                "Pass confirm=YES to delete all attendance"
            );
        }

        return prisma.staff.deleteMany({});
    };