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
    page = parseInt(page);
    limit = parseInt(limit);

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

    if (designationId != null) {
        where.designationId = Number(designationId);
    }

    if (postingPlaceId != null) {
        where.postingPlaceId = Number(postingPlaceId);
    }

    if (sectionId != null) {
        where.sectionId = Number(sectionId);
    }

    const [data, total] = await Promise.all([
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
        }),
        prisma.staff.count({ where }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    }
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