import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSectionsService = async (
  query
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search?.trim() || "";
  const postingPlaceId = query.postingPlaceId
    ? Number(query.postingPlaceId)
    : undefined;

  const where = {
    ...(search && {
      section: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(postingPlaceId && {
      postingPlaceId,
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.section.findMany({
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
        section: "asc",
      },
      skip,
      take: limit,
    }),

    prisma.section.count({
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