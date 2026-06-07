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