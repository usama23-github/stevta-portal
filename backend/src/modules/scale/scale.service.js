import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createScaleService = async ({ scale }) => {
    const existingScale = await prisma.scale.findUnique({
        where: {
            scale,
        },
    });

    if (existingScale) {
        throw new Error("Scale already exists");
    }

    const newScale = await prisma.scale.create({
        data: {
            scale,
        },
        select: {
            id: true,
            scale: true,
            createdAt: true,
        },
    });

    return newScale;
};

export const getAllScalesService = async () => {
    const scales =
        await prisma.scale.findMany({
            orderBy: {
                id: "desc",
            },
        });

    return {
        scales
    }
};