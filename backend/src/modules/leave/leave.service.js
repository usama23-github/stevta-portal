import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ========================================
// CREATE LEAVE TYPE
// ========================================

export const createLeaveTypeService = async (name) => {
  const leaveTypeName = name.trim();

  // Check duplicate
  const existingLeaveType =
    await prisma.leaveType.findUnique({
      where: {
        name: leaveTypeName,
      },
    });

  if (existingLeaveType) {
    const error = new Error(
      "Leave type already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const leaveType =
    await prisma.leaveType.create({
      data: {
        name: leaveTypeName,
      },
    });

  return leaveType;
};


// ========================================
// GET ALL LEAVE TYPES
// ========================================

export const getAllLeaveTypesService = async ({
  page = 1,
  limit = 10,
  search = "",
  sortField = "name",
  sortOrder = "asc",
}) => {

  // ----------------------------------------
  // Convert pagination values to integers
  // ----------------------------------------

  page = parseInt(page);
  limit = parseInt(limit);

  // Prevent invalid values
  if (page < 1) {
    page = 1;
  }

  if (limit < 1) {
    limit = 10;
  }

  // Optional maximum limit
  if (limit > 100) {
    limit = 100;
  }

  // ----------------------------------------
  // Calculate skip
  // ----------------------------------------

  const skip = (page - 1) * limit;


  // ----------------------------------------
  // WHERE condition
  // ----------------------------------------

  const where = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }


  // ----------------------------------------
  // Allowed sort fields
  // ----------------------------------------

  const allowedSortFields = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
  ];

  if (!allowedSortFields.includes(sortField)) {
    sortField = "name";
  }


  // ----------------------------------------
  // Sort order
  // ----------------------------------------

  sortOrder =
    sortOrder.toLowerCase() === "desc"
      ? "desc"
      : "asc";


  // ----------------------------------------
  // Get total + data
  // ----------------------------------------

  const [total, data] =
    await Promise.all([

      prisma.leaveType.count({
        where,
      }),

      prisma.leaveType.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          [sortField]: sortOrder,
        },
      }),

    ]);


  // ----------------------------------------
  // Return data + meta
  // ----------------------------------------

  return {
    data,

    meta: {
      total,

      page,

      limit,

      totalPages:
        Math.ceil(total / limit),

      sortField,

      sortOrder,
    },
  };
};