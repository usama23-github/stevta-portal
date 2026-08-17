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

export const updateSectionDepartmentService = async ({
    sectionId,
    departmentId,
}) => {
    // Check section exists
    const section = await prisma.section.findUnique({
        where: {
            id: Number(sectionId),
        },
        select: {
            id: true,
            section: true,
            postingPlaceId: true,
        },
    });

    if (!section) {
        throw new Error("Section not found");
    }

    // Check department exists and belongs to same posting place
    const department = await prisma.department.findFirst({
        where: {
            id: Number(departmentId),
            postingPlaceId: section.postingPlaceId,
        },
        select: {
            id: true,
            department: true,
            postingPlaceId: true,
        },
    });

    if (!department) {
        throw new Error(
            "Department not found or does not belong to the section's posting place"
        );
    }

    // Update section
    const updatedSection = await prisma.section.update({
        where: {
            id: Number(sectionId),
        },
        data: {
            departmentId: Number(departmentId),
        },
        select: {
            id: true,
            section: true,
            postingPlaceId: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true,

            postingPlace: {
                select: {
                    id: true,
                    postingPlace: true,
                },
            },

            department: {
                select: {
                    id: true,
                    department: true,
                },
            },
        },
    });

    return updatedSection;
};