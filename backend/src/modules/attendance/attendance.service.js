import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from "@prisma/client";

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

  const attendanceLog = await prisma.attendanceLogs.create({
    data: {
      empNo,
      inOutStatus,
      dateTime: new Date(dateTime),
      deviceId,
    },
  });

  return attendanceLog;
};

import prisma from "../../config/prisma.js";

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
    checkInCutoff.setHours(9, 1, 0, 0);

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