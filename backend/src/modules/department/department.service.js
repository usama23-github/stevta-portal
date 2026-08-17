import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDepartmentService = async ({
    department,
    postingPlaceId,
}) => {
    const existingDepartment = await prisma.department.findUnique({
        where: {
            department_postingPlaceId: {
                department,
                postingPlaceId,
            },
        },
    });

    if (existingDepartment) {
        throw new Error("Department already exists for this posting place");
    }

    const newDepartment = await prisma.department.create({
        data: {
            department,
            postingPlaceId,
        },
        select: {
            id: true,
            department: true,
            postingPlaceId: true,
            createdAt: true,
        },
    });

    return newDepartment;
};

export const getAllDepartmentsService = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search?.trim() || "";

    const postingPlaceId = query.postingPlaceId
        ? Number(query.postingPlaceId)
        : undefined;

    const where = {
        ...(search && {
            department: {
                contains: search,
                mode: "insensitive",
            },
        }),

        ...(postingPlaceId && {
            postingPlaceId,
        }),
    };

    const [data, total] = await prisma.$transaction([
        prisma.department.findMany({
            where,
            include: {
                postingPlace: {
                    select: {
                        id: true,
                        postingPlace: true,
                    },
                },
            },
            orderBy: {
                department: "asc",
            },
            skip,
            take: limit,
        }),

        prisma.department.count({
            where,
        }),
    ]);

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