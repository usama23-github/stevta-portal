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

export const updateSectionNameService = async ({
  sectionId,
  section,
}) => {
  const sectionIdNumber = Number(sectionId);

  // Check if section exists
  const existingSection = await prisma.section.findUnique({
    where: {
      id: sectionIdNumber,
    },
    select: {
      id: true,
      section: true,
      postingPlaceId: true,
    },
  });

  if (!existingSection) {
    throw new Error("Section not found");
  }

  // Check duplicate section name in the same posting place
  const duplicateSection = await prisma.section.findFirst({
    where: {
      section: {
        equals: section,
      },
      postingPlaceId: existingSection.postingPlaceId,
      NOT: {
        id: sectionIdNumber,
      },
    },
  });

  if (duplicateSection) {
    throw new Error(
      "Section with this name already exists in this posting place"
    );
  }

  // Update section name
  const updatedSection = await prisma.section.update({
    where: {
      id: sectionIdNumber,
    },
    data: {
      section,
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

export const getSectionsByDepartmentIdService = async (departmentId) => {
  const departmentIdNumber = Number(departmentId);

  if (!departmentIdNumber || Number.isNaN(departmentIdNumber)) {
    throw new Error("Invalid department ID");
  }

  // Check department exists
  const department = await prisma.department.findUnique({
    where: {
      id: departmentIdNumber,
    },
    select: {
      id: true,
      department: true,
      postingPlaceId: true,
    },
  });

  if (!department) {
    throw new Error("Department not found");
  }

  // Get sections
  const sections = await prisma.section.findMany({
    where: {
      departmentId: departmentIdNumber,
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
    },
    orderBy: {
      section: "asc",
    },
  });

  return {
    department,
    sections,
  };
};