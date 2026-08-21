import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'attendance.json');

export const saveAttendance = async (data) => {
  let records = [];

  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    records = JSON.parse(fileData);
  } catch {
    records = [];
  }

  console.log("Attendance Data", data)

  const attendance = {
    id: Date.now(),
    employeeId: data.employeeId,
    status: data.inOutStatus,
    dateTime: data.dateTime,
    deviceId: data.deviceId,
    date: new Date().toISOString()
  };

  records.push(attendance);

  await fs.writeFile(
    filePath,
    JSON.stringify(records, null, 2)
  );

  return attendance;
};

export const createAttendanceLog = async (payload) => {
  const {
    empNo,
    inOutStatus,
    dateTime,
    deviceId,
  } = payload;

  const parsedDate = dayjs.tz(dateTime, "Asia/Karachi").toDate();

  try {
    return await prisma.attendanceLogs.create({
      data: {
        empNo,
        inOutStatus,
        dateTime: new Date(parsedDate),
        deviceId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Attendance log already exists.");
    }

    throw error;
  }
};

const ATTENDANCE_STATUS = {
  PRESENT: 1,
  ABSENT: 2,
};

const CHECKIN_STATUS = {
  ON_TIME: 1,
  LATE: 2,
};

const CHECKOUT_STATUS = {
  NORMAL: 1,
  EARLY: 2,
};

export const generateAttendanceService =
  async (date) => {
    const targetDate = date
      ? new Date(date)
      : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const checkInCutoff = new Date(startOfDay);
    checkInCutoff.setHours(9, 31, 0, 0);

    const absentCutoff = new Date(startOfDay);
    absentCutoff.setHours(11, 0, 0, 0);

    const checkoutStart = new Date(startOfDay);
    checkoutStart.setHours(13, 0, 0, 0);

    const officeClosing = new Date(startOfDay);
    officeClosing.setHours(17, 0, 0, 0);

    const isToday =
      startOfDay.toDateString() ===
      new Date().toDateString();

    const staffList =
      await prisma.staff.findMany({
        select: {
          empNo: true,
        },
      });

    const logs =
      await prisma.attendanceLogs.findMany({
        where: {
          dateTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          dateTime: "asc",
        },
      });

    const logsByEmpNo = new Map();

    for (const log of logs) {
      if (!logsByEmpNo.has(log.empNo)) {
        logsByEmpNo.set(log.empNo, []);
      }

      logsByEmpNo.get(log.empNo).push(log);
    }

    const operations = [];

    for (const staff of staffList) {
      const employeeLogs =
        logsByEmpNo.get(staff.empNo) || [];

      // Skip employees with no logs
      if (employeeLogs.length === 0 && new Date() < absentCutoff) {
        continue;
      }

      let attendanceStatusId =
        ATTENDANCE_STATUS.PRESENT;

      let checkInTime = null;
      let checkInStatusId = null;

      let checkOutTime = null;
      let checkOutStatusId = null;

      if (employeeLogs.length === 0) {
        if (
          !isToday ||
          new Date() >= absentCutoff
        ) {
          attendanceStatusId =
            ATTENDANCE_STATUS.ABSENT;
        }
      } else {
        const firstLog = employeeLogs[0];

        checkInTime = firstLog.dateTime;

        checkInStatusId =
          firstLog.dateTime <= checkInCutoff
            ? CHECKIN_STATUS.ON_TIME
            : CHECKIN_STATUS.LATE;

        const checkoutLogs =
          employeeLogs.filter(
            (log) =>
              log.dateTime >= checkoutStart
          );

        if (checkoutLogs.length > 0) {
          const lastLog =
            checkoutLogs[
            checkoutLogs.length - 1
            ];

          checkOutTime = lastLog.dateTime;

          checkOutStatusId =
            lastLog.dateTime >= officeClosing
              ? CHECKOUT_STATUS.NORMAL
              : CHECKOUT_STATUS.EARLY;
        }
      }

      operations.push(
        prisma.attendance.upsert({
          where: {
            empNo_attendanceDate: {
              empNo: staff.empNo,
              attendanceDate: startOfDay,
            },
          },
          create: {
            empNo: staff.empNo,
            attendanceDate: startOfDay,

            attendanceStatusId,

            checkInTime,
            checkInStatusId,

            checkOutTime,
            checkOutStatusId,
          },
          update: {
            attendanceStatusId,

            checkInTime,
            checkInStatusId,

            checkOutTime,
            checkOutStatusId,
          },
        })
      );
    }

    await prisma.$transaction(operations);

    return {
      date: startOfDay,
      totalStaff: staffList.length,
      processed: operations.length,
    };
  };

export const getAttendanceLogsService =
  async (date) => {
    const targetDate = date
      ? new Date(date)
      : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.attendanceLogs.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });
  };

export const getStaffAttendanceService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortField = query.sortField || "attendanceDate";
  const sortOrder = query.sortOrder === "desc" ? "desc" : "asc";

  const where = {};

  // Date filter
  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    where.attendanceDate = {
      gte: start,
      lte: end,
    };
  } else {
    where.attendanceDate = {};

    if (query.fromDate) {
      const from = new Date(query.fromDate);
      from.setHours(0, 0, 0, 0);
      where.attendanceDate.gte = from;
    }

    if (query.toDate) {
      const to = new Date(query.toDate);
      to.setHours(23, 59, 59, 999);
      where.attendanceDate.lte = to;
    }

    // Default to today when no date filters are provided
    if (!query.fromDate && !query.toDate) {
      const today = new Date();

      const start = new Date(today);
      start.setHours(0, 0, 0, 0);

      const end = new Date(today);
      end.setHours(23, 59, 59, 999);

      where.attendanceDate = {
        gte: start,
        lte: end,
      };
    }
  }

  // Staff filters
  where.staff = {};

  if (query.postingPlaceId) {
    where.staff.postingPlaceId = Number(query.postingPlaceId);
  }

  if (query.sectionId) {
    where.staff.sectionId = Number(query.sectionId);
  }

  if (query.designationId) {
    where.staff.designationId = Number(query.designationId);
  }

  // Attendance filters
  if (query.attendanceStatusId) {
    where.attendanceStatusId = Number(query.attendanceStatusId);
  }

  if (query.checkInStatusId) {
    where.checkInStatusId = Number(query.checkInStatusId);
  }

  if (query.checkOutStatusId) {
    where.checkOutStatusId = Number(query.checkOutStatusId);
  }

  // Search
  if (query.search) {
    where.staff.OR = [
      {
        empNo: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        department: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        designation: {
          is: {
            designation: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        designation: {
          is: {
            scale: {
              is: {
                scale: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },
      {
        postingPlace: {
          is: {
            postingPlace: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      },
      {
        section: {
          is: {
            section: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  // Remove empty staff filter
  if (Object.keys(where.staff).length === 0) {
    delete where.staff;
  }

  const [rows, total] = await prisma.$transaction([
    prisma.attendance.findMany({
      where,

      include: {
        staff: {
          select: {
            empNo: true,
            name: true,

            designation: {
              select: {
                designation: true,
                scale: {
                  select: {
                    scale: true,
                  },
                },
              },
            },

            postingPlace: {
              select: {
                postingPlace: true,
              },
            },

            section: {
              select: {
                section: true,

                department: {
                  select: {
                    department: true,
                  },
                },
              },
            },
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        [sortField]: sortOrder,
      },
    }),

    prisma.attendance.count({
      where,
    }),
  ]);

  const data = rows.map((row) => {
    let workingHours = null;

    if (row.checkInTime && row.checkOutTime) {
      const diffMs = row.checkOutTime.getTime() - row.checkInTime.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor(
        (diffMs % (1000 * 60)) / 1000
      );

      workingHours = `${hours}h ${minutes}m ${seconds}s`;
    }

    return {
      empNo: row.staff.empNo,

      employeeName: row.staff.name,

      designation: row.staff.designation
        ? `${row.staff.designation.designation} ${row.staff.designation.scale?.scale ?? ""
          }`.trim()
        : null,

      department:
        row.staff.section?.department?.department ?? null,

      postingPlace:
        row.staff.postingPlace?.postingPlace ?? null,

      section:
        row.staff.section?.section ?? null,

      date: dayjs(row.attendanceDate)
        .tz("Asia/Karachi")
        .format("YYYY-MM-DD"),

      attendanceStatusId: row.attendanceStatusId,

      attendanceStatus:
        row.attendanceStatusId === 1
          ? "Present"
          : "Absent",

      checkIn: row.checkInTime
        ? dayjs(row.checkInTime)
          .tz("Asia/Karachi")
          .format("hh:mm:ss A")
        : null,

      checkInStatusId: row.checkInStatusId,

      checkInStatus:
        row.checkInStatusId === 1
          ? "On Time"
          : row.checkInStatusId === 2
            ? "Late"
            : null,

      checkOut: row.checkOutTime
        ? dayjs(row.checkOutTime)
          .tz("Asia/Karachi")
          .format("hh:mm:ss A")
        : null,

      checkOutStatusId: row.checkOutStatusId,

      checkOutStatus:
        row.checkOutStatusId === 1
          ? "On Time"
          : row.checkOutStatusId === 2
            ? "Early"
            : null,

      workingHours,
    };
  });

  return {
    data,

    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortField,
      sortOrder,
    },
  };
};

export const deleteAllAttendanceService =
  async (confirm) => {
    if (confirm !== "YES") {
      throw new Error(
        "Pass confirm=YES to delete all attendance"
      );
    }

    return prisma.attendance.deleteMany({});
  };

export const getAttendanceSummaryService = async (query) => {
  // ============================
  // Attendance Filter
  // ============================

  const attendanceWhere = {};
  const staffWhere = {};

  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    attendanceWhere.attendanceDate = {
      gte: start,
      lte: end,
    };
  } else {
    attendanceWhere.attendanceDate = {};

    if (query.fromDate) {
      const from = new Date(query.fromDate);
      from.setHours(0, 0, 0, 0);
      attendanceWhere.attendanceDate.gte = from;
    }

    if (query.toDate) {
      const to = new Date(query.toDate);
      to.setHours(23, 59, 59, 999);
      attendanceWhere.attendanceDate.lte = to;
    }

    if (!query.fromDate && !query.toDate) {
      const today = new Date();

      const start = new Date(today);
      start.setHours(0, 0, 0, 0);

      const end = new Date(today);
      end.setHours(23, 59, 59, 999);

      attendanceWhere.attendanceDate = {
        gte: start,
        lte: end,
      };
    }
  }

  // ============================
  // Staff Filters
  // ============================

  if (query.postingPlaceId) {
    staffWhere.postingPlaceId = Number(query.postingPlaceId);
  }

  if (query.sectionId) {
    staffWhere.sectionId = Number(query.sectionId);
  }

  if (query.designationId) {
    staffWhere.designationId = Number(query.designationId);
  }

  if (Object.keys(staffWhere).length) {
    attendanceWhere.staff = staffWhere;
  }

  // ============================
  // Fetch Data
  // ============================

  const [staffs, attendances] = await prisma.$transaction([
    prisma.staff.findMany({
      where: staffWhere,
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.attendance.findMany({
      where: attendanceWhere,
      select: {
        attendanceDate: true,
        attendanceStatusId: true,
        checkInStatusId: true,
        checkOutStatusId: true,
      },
      orderBy: {
        attendanceDate: "asc",
      },
    }),
  ]);

  // ============================
  // Build Summary
  // ============================

  const summaryMap = {};

  let staffIndex = 0;

  for (const attendance of attendances) {
    const dateKey = dayjs(attendance.attendanceDate).format("YYYY-MM-DD");

    if (!summaryMap[dateKey]) {
      const endOfDate = dayjs(dateKey).endOf("day").valueOf();

      while (
        staffIndex < staffs.length &&
        new Date(staffs[staffIndex].createdAt).getTime() <= endOfDate
      ) {
        staffIndex++;
      }

      summaryMap[dateKey] = {
        date: dateKey,
        totalStaff: staffIndex,
        present: 0,
        absent: 0,
        late: 0,
        earlyCheckout: 0,
      };
    }

    if (attendance.attendanceStatusId === 1) {
      summaryMap[dateKey].present++;
    } else if (attendance.attendanceStatusId === 2) {
      summaryMap[dateKey].absent++;
    }

    if (attendance.checkInStatusId === 2) {
      summaryMap[dateKey].late++;
    }

    if (attendance.checkOutStatusId === 2) {
      summaryMap[dateKey].earlyCheckout++;
    }
  }

  const summary = Object.values(summaryMap).map((item) => {
    const attendanceMarked = item.present + item.absent;

    return {
      ...item,
      notMarked: Math.max(item.totalStaff - attendanceMarked, 0),
      attendancePercentage:
        item.totalStaff === 0
          ? 0
          : Number(((item.present / item.totalStaff) * 100).toFixed(2)),
    };
  });

  // ============================
  // Single Day Response
  // ============================

  if (query.date) {
    const reportEnd = dayjs(query.date).endOf("day").valueOf();

    const totalStaff = staffs.filter(
      (staff) => new Date(staff.createdAt).getTime() <= reportEnd
    ).length;

    return (
      summary[0] || {
        date: dayjs(query.date).format("YYYY-MM-DD"),
        totalStaff,
        present: 0,
        absent: 0,
        late: 0,
        earlyCheckout: 0,
        notMarked: totalStaff,
        attendancePercentage: 0,
      }
    );
  }

  // ============================
  // Date Range Response
  // ============================

  return summary;
};

export const getSectionAttendanceSummaryService = async (query) => {
  // ==========================================
  // Build Attendance Filter
  // ==========================================

  const attendanceWhere = {};
  const staffWhere = {};

  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    attendanceWhere.attendanceDate = {
      gte: start,
      lte: end,
    };
  } else {
    attendanceWhere.attendanceDate = {};

    if (query.fromDate) {
      const from = new Date(query.fromDate);
      from.setHours(0, 0, 0, 0);
      attendanceWhere.attendanceDate.gte = from;
    }

    if (query.toDate) {
      const to = new Date(query.toDate);
      to.setHours(23, 59, 59, 999);
      attendanceWhere.attendanceDate.lte = to;
    }

    if (!query.fromDate && !query.toDate) {
      const today = new Date();

      const start = new Date(today);
      start.setHours(0, 0, 0, 0);

      const end = new Date(today);
      end.setHours(23, 59, 59, 999);

      attendanceWhere.attendanceDate = {
        gte: start,
        lte: end,
      };
    }
  }

  // ==========================================
  // Staff Filters
  // ==========================================

  if (query.postingPlaceId) {
    staffWhere.postingPlaceId = Number(query.postingPlaceId);
  }

  if (query.sectionId) {
    staffWhere.sectionId = Number(query.sectionId);
  }

  if (query.designationId) {
    staffWhere.designationId = Number(query.designationId);
  }

  // ==========================================
  // Fetch Data
  // ==========================================

  const [sections, staffs, attendances] = await prisma.$transaction([
    prisma.section.findMany({
      where: query.sectionId
        ? {
          id: Number(query.sectionId),
        }
        : undefined,
      orderBy: {
        section: "asc",
      },
      select: {
        id: true,
        section: true,
      },
    }),

    prisma.staff.findMany({
      where: staffWhere,
      select: {
        sectionId: true,
        createdAt: true,
      },
    }),

    prisma.attendance.findMany({
      where: {
        ...attendanceWhere,
        ...(Object.keys(staffWhere).length
          ? {
            staff: staffWhere,
          }
          : {}),
      },
      include: {
        staff: {
          select: {
            sectionId: true,
          },
        },
      },
      orderBy: {
        attendanceDate: "asc",
      },
    }),
  ]);

  // ==========================================
  // Group Attendance By Date
  // ==========================================

  const attendanceByDate = attendances.reduce((acc, attendance) => {
    const date = dayjs(attendance.attendanceDate).format("YYYY-MM-DD");

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(attendance);

    return acc;
  }, {});

  // ==========================================
  // Generate Date-wise Section Summary
  // ==========================================

  const result = Object.entries(attendanceByDate).map(
    ([date, dayAttendances]) => {
      const reportEnd = dayjs(date).endOf("day").valueOf();

      const sectionsSummary = sections.map((section) => {
        const totalStaff = staffs.filter(
          (staff) =>
            staff.sectionId === section.id &&
            new Date(staff.createdAt).getTime() <= reportEnd
        ).length;

        const sectionAttendances = dayAttendances.filter(
          (attendance) => attendance.staff.sectionId === section.id
        );

        let present = 0;
        let absent = 0;
        let late = 0;
        let earlyCheckout = 0;

        sectionAttendances.forEach((attendance) => {
          if (attendance.attendanceStatusId === 1) {
            present++;
          } else if (attendance.attendanceStatusId === 2) {
            absent++;
          }

          if (attendance.checkInStatusId === 2) {
            late++;
          }

          if (attendance.checkOutStatusId === 2) {
            earlyCheckout++;
          }
        });

        const attendanceMarked = present + absent;

        return {
          sectionId: section.id,
          section: section.section,
          totalStaff,
          present,
          absent,
          late,
          earlyCheckout,
          notMarked: Math.max(totalStaff - attendanceMarked, 0),
          attendancePercentage:
            totalStaff > 0
              ? Number(((present / totalStaff) * 100).toFixed(2))
              : 0,
        };
      });

      return {
        date,
        sections: sectionsSummary,
      };
    }
  );

  return result;
};