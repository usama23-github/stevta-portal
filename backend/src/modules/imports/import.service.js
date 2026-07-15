import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const importHierarchy = async (rows) => {
  const regionsMap = new Map();
  const districtsMap = new Map();
  const subdivisionsMap = new Map();

  for (const row of rows) {
    // REGIONS

    regionsMap.set(row.region_id, {
      id: Number(row.region_id),
      name: row.region_name,
    });

    // DISTRICTS

    districtsMap.set(row.district_id, {
      id: Number(row.district_id),
      name: row.district_name,
      regionId: Number(row.region_id),
    });

    // SUBDIVISIONS

    subdivisionsMap.set(row.subdivision_id, {
      id: Number(row.subdivision_id),
      name: row.subdivision_name,
      districtId: Number(row.district_id),
    });
  }

  const regions = [...regionsMap.values()];
  const districts = [...districtsMap.values()];
  const subdivisions = [...subdivisionsMap.values()];

  // INSERT ORDER IMPORTANT

  await prisma.region.createMany({
    data: regions,
    skipDuplicates: true,
  });

  await prisma.district.createMany({
    data: districts,
    skipDuplicates: true,
  });

  await prisma.subdivision.createMany({
    data: subdivisions,
    skipDuplicates: true,
  });

  return {
    regions: regions.length,
    districts: districts.length,
    subdivisions: subdivisions.length,
  };
};

export const importStaff = async (rows) => {
  const staffMap = new Map();

  for (const row of rows) {
    staffMap.set(row.emp_no, {
      empNo: row.emp_no,
      name: row.employee_name,
      designationId: row.designationId || null,
      postingPlaceId: row.postingPlaceId || null,
      sectionId: row.sectionId || null,
    });
  }

  const staff = [...staffMap.values()];

  await prisma.$transaction(
    staff.map((item) =>
      prisma.staff.upsert({
        where: {
          empNo: item.empNo,
        },
        create: item,
        update: {
          name: item.name,
          designationId: item.designationId,
          postingPlaceId: item.postingPlaceId,
          sectionId: item.sectionId,
        },
      })
    )
  );

  return {
    total: staff.length,
    message: "Staff imported successfully.",
  };
};

export const importSection = async (rows) => {
  const sectionMap = new Map();

  for (const row of rows) {
    // SECTION

    sectionMap.set(row.section, {
      section: row.section,
      postingPlaceId: row.postingPlaceId
    });
  }

  const section = [...sectionMap.values()];

  // INSERT ORDER IMPORTANT

  await prisma.section.createMany({
    data: section,
    skipDuplicates: true,
  });

  return {
    section: section.length,
  };
};

export const importDesignation = async (rows) => {
  const designationMap = new Map();

  for (const row of rows) {
    // DESIGNATION

    designationMap.set(row.designation, {
      designation: row.designation,
      scaleId: row.scaleId,
      postingPlaceId: row.postingPlaceId
    });
  }

  const designation = [...designationMap.values()];

  await prisma.designation.createMany({
    data: designation,
    skipDuplicates: true,
  });

  return {
    designation: designation.length,
  };
};