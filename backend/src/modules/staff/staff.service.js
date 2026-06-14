import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllStaff = async ({ page, limit, search, sort }) => {
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const where = search
        ? {
            OR: [
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
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    department: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }
        : {};

    const [data, total] = await Promise.all([
        prisma.staff.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                empNo: sort === "asc" ? "asc" : "desc",
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