import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPostingPlaceService = async ({ postingPlace, order }) => {
    const existingPostingPlace = await prisma.postingPlace.findUnique({
        where: {
            postingPlace,
        },
    });

    if (existingPostingPlace) {
        throw new Error("Posting Place already exists");
    }

    const newPostingPlace = await prisma.postingPlace.create({
        data: {
            postingPlace,
            order,
        },
        select: {
            id: true,
            postingPlace: true,
            order: true,
            createdAt: true,
        },
    });

    return newPostingPlace;
};

export const getAllPostingPlaceService = async () => {
    const postingPlaces =
        await prisma.postingPlace.findMany({
            orderBy: {
                order: "asc",
            },
            select: {
                id: true,
                postingPlace: true,
            },
        });

    return {
        postingPlaces
    }
};