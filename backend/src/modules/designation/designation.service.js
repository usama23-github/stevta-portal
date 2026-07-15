import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllDesignationsService = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search?.trim() || "";

    const postingPlaceId = query.postingPlaceId
        ? Number(query.postingPlaceId)
        : undefined;

    const scaleId = query.scaleId
        ? Number(query.scaleId)
        : undefined;

    const where = {
        ...(search && {
            designation: {
                contains: search,
                mode: "insensitive",
            },
        }),

        ...(postingPlaceId && {
            postingPlaceId,
        }),

        ...(scaleId && {
            scaleId,
        }),
    };

    const [data, total] = await prisma.$transaction([
        prisma.designation.findMany({
            where,
            include: {
                scale: {
                    select: {
                        id: true,
                        scale: true,
                    },
                },
                postingPlace: {
                    select: {
                        id: true,
                        postingPlace: true,
                    },
                },
            },
            orderBy: {
                designation: "asc",
            },
            skip,
            take: limit,
        }),

        prisma.designation.count({
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