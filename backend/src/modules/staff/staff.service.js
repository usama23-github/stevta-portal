import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllStaff = async ({ page, limit, search, sort }) => {
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
        where.OR = [
            { empNo: { contains: search } },
            { name: { contains: search, mode: "insensitive" } },
            { designation: { is: { name: { contains: search, mode: "insensitive" } } } },
            { postingPlace: { is: { name: { contains: search, mode: "insensitive" } } } },
            { section: { is: { name: { contains: search, mode: "insensitive" } } } },
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
                        name: true,
                    },
                },
                postingPlace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                section: {
                    select: {
                        id: true,
                        name: true,
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