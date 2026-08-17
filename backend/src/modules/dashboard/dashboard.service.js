import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ATTENDANCE_STATUS = {
    PRESENT: 1,
    ABSENT: 2,
};

const CHECK_IN_STATUS = {
    ON_TIME: 1,
    LATE: 2,
};

const CHECK_OUT_STATUS = {
    NORMAL: 1,
    EARLY: 2,
};

const startOfDay = (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

const endOfDay = (date) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
};

const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};

export const getAttendanceDashboard = async (date = new Date()) => {
    const selectedDate = new Date(date);

    const todayStart = startOfDay(selectedDate);
    const todayEnd = endOfDay(selectedDate);

    // =====================================================
    // 1. TOTAL ACTIVE STAFF
    // =====================================================

    const totalEmployees = await prisma.staff.count();

    // =====================================================
    // 2. TODAY'S ATTENDANCE
    // =====================================================

    const todayAttendance = await prisma.attendance.findMany({
        where: {
            attendanceDate: {
                gte: todayStart,
                lte: todayEnd,
            },
        },

        select: {
            empNo: true,
            attendanceStatusId: true,
            checkInStatusId: true,
            checkOutStatusId: true,
            leaveTypeId: true,

            staff: {
                select: {
                    id: true,
                    empNo: true,
                    sectionId: true,
                },
            },
        },
    });

    // =====================================================
    // 3. TODAY'S BASIC STATS
    // =====================================================

    const present = todayAttendance.filter(
        (attendance) =>
            attendance.attendanceStatusId ===
            ATTENDANCE_STATUS.PRESENT
    ).length;

    const absent = todayAttendance.filter(
        (attendance) =>
            attendance.attendanceStatusId ===
            ATTENDANCE_STATUS.ABSENT
    ).length;

    const lateCheckIn = todayAttendance.filter(
        (attendance) =>
            attendance.checkInStatusId ===
            CHECK_IN_STATUS.LATE
    ).length;

    const earlyCheckout = todayAttendance.filter(
        (attendance) =>
            attendance.checkOutStatusId ===
            CHECK_OUT_STATUS.EARLY
    ).length;

    // =====================================================
    // 4. TODAY'S LEAVE
    // =====================================================

    const leavesToday = await prisma.leave.findMany({
        where: {
            fromDate: {
                lte: todayEnd,
            },

            toDate: {
                gte: todayStart,
            },

            // If you have approval status later,
            // add it here.
        },

        select: {
            staffId: true,
        },
    });

    const onLeave = leavesToday.length;

    // =====================================================
    // ATTENDANCE LOOKUP
    // =====================================================

    const attendanceMap = new Map();

    todayAttendance.forEach((attendance) => {
        attendanceMap.set(
            attendance.empNo,
            attendance
        );
    });

    // =====================================================
    // LEAVE LOOKUP
    // =====================================================

    const leaveStaffIds = new Set(
        leavesToday.map((leave) => leave.staffId)
    );

    // =====================================================
    // 5. SECTION-WISE DATA
    // =====================================================

    const sections = await prisma.section.findMany({
        select: {
            id: true,
            section: true,

            staff: {
                select: {
                    id: true,
                    empNo: true,
                },
            },
        },

        orderBy: {
            section: "asc",
        },
    });

    // =====================================================
    // 6. DEPARTMENT-WISE DATA
    // =====================================================

    const departments = await prisma.department.findMany({
        select: {
            id: true,
            department: true,

            section: {
                select: {
                    id: true,
                    section: true,

                    staff: {
                        select: {
                            id: true,
                            empNo: true,
                        },
                    },
                },
            },
        },

        orderBy: {
            department: "asc",
        },
    });

    const departmentWise = departments.map((department) => {
        // -----------------------------------------
        // Combine all staff from department sections
        // -----------------------------------------

        const staffMap = new Map();

        department.section.forEach((section) => {
            section.staff.forEach((staff) => {
                staffMap.set(staff.id, staff);
            });
        });

        const staff = Array.from(staffMap.values());

        const total = staff.length;

        let presentCount = 0;
        let absentCount = 0;
        let leaveCount = 0;
        let lateCount = 0;
        let earlyCount = 0;

        staff.forEach((staff) => {

            // -----------------------------------------
            // Leave
            // -----------------------------------------

            if (leaveStaffIds.has(staff.id)) {
                leaveCount++;
            }

            // -----------------------------------------
            // Attendance
            // -----------------------------------------

            const attendance = attendanceMap.get(
                staff.empNo
            );

            if (!attendance) {
                return;
            }

            // -----------------------------------------
            // Present
            // -----------------------------------------

            if (
                attendance.attendanceStatusId ===
                ATTENDANCE_STATUS.PRESENT
            ) {
                presentCount++;
            }

            // -----------------------------------------
            // Absent
            // -----------------------------------------

            if (
                attendance.attendanceStatusId ===
                ATTENDANCE_STATUS.ABSENT
            ) {
                absentCount++;
            }

            // -----------------------------------------
            // Late Check-in
            // -----------------------------------------

            if (
                attendance.checkInStatusId ===
                CHECK_IN_STATUS.LATE
            ) {
                lateCount++;
            }

            // -----------------------------------------
            // Early Checkout
            // -----------------------------------------

            if (
                attendance.checkOutStatusId ===
                CHECK_OUT_STATUS.EARLY
            ) {
                earlyCount++;
            }
        });

        return {
            departmentId: department.id,

            department: department.department,

            total,

            present: presentCount,

            absent: absentCount,

            onLeave: leaveCount,

            lateCheckIn: lateCount,

            earlyCheckout: earlyCount,

            absencePercentage:
                total > 0
                    ? Number(
                        ((absentCount / total) * 100).toFixed(1)
                    )
                    : 0,
        };
    });

    const sectionWise = sections.map((section) => {
        const total = section.staff.length;

        let presentCount = 0;
        let absentCount = 0;
        let leaveCount = 0;
        let lateCount = 0;
        let earlyCount = 0;

        section.staff.forEach((staff) => {
            // -----------------------------------------
            // Leave
            // -----------------------------------------

            if (leaveStaffIds.has(staff.id)) {
                leaveCount++;
            }

            const attendance = attendanceMap.get(
                staff.empNo
            );

            if (!attendance) {
                return;
            }

            // -----------------------------------------
            // Present
            // -----------------------------------------

            if (
                attendance.attendanceStatusId ===
                ATTENDANCE_STATUS.PRESENT
            ) {
                presentCount++;
            }

            // -----------------------------------------
            // Absent
            // -----------------------------------------

            if (
                attendance.attendanceStatusId ===
                ATTENDANCE_STATUS.ABSENT
            ) {
                absentCount++;
            }

            // -----------------------------------------
            // Late Check-in
            // -----------------------------------------

            if (
                attendance.checkInStatusId ===
                CHECK_IN_STATUS.LATE
            ) {
                lateCount++;
            }

            // -----------------------------------------
            // Early Checkout
            // -----------------------------------------

            if (
                attendance.checkOutStatusId ===
                CHECK_OUT_STATUS.EARLY
            ) {
                earlyCount++;
            }
        });

        return {
            sectionId: section.id,
            section: section.section,

            total,

            present: presentCount,

            absent: absentCount,

            onLeave: leaveCount,

            lateCheckIn: lateCount,

            earlyCheckout: earlyCount,

            absencePercentage:
                total > 0
                    ? Number(
                        ((absentCount / total) * 100).toFixed(1)
                    )
                    : 0,
        };
    });

    // =====================================================
    // 6. LAST 7 DAYS
    // =====================================================

    const sevenDaysAgo = new Date(todayStart);

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 6
    );

    const last7DaysAttendance =
        await prisma.attendance.findMany({
            where: {
                attendanceDate: {
                    gte: sevenDaysAgo,
                    lte: todayEnd,
                },
            },

            select: {
                empNo: true,
                attendanceDate: true,
                attendanceStatusId: true,
            },

            orderBy: {
                attendanceDate: "asc",
            },
        });

    // =====================================================
    // 7. LAST 7 DAYS REPORT
    // =====================================================

    const last7Days = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sevenDaysAgo);

        currentDate.setDate(
            sevenDaysAgo.getDate() + i
        );

        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);

        const records = last7DaysAttendance.filter(
            (attendance) => {
                const attendanceDate =
                    new Date(attendance.attendanceDate);

                return (
                    attendanceDate >= dayStart &&
                    attendanceDate <= dayEnd
                );
            }
        );

        const absentCount = records.filter(
            (attendance) =>
                attendance.attendanceStatusId ===
                ATTENDANCE_STATUS.ABSENT
        ).length;

        last7Days.push({
            date: formatDate(currentDate),

            total: totalEmployees,

            absent: absentCount,

            absencePercentage:
                totalEmployees > 0
                    ? Number(
                        (
                            (absentCount / totalEmployees) *
                            100
                        ).toFixed(1)
                    )
                    : 0,
        });
    }

    // =====================================================
    // 8. RETURN
    // =====================================================

    return {
        attendance: {
            totalEmployees,

            present,

            absent,

            onLeave,

            lateCheckIn,

            earlyCheckout,
        },

        sectionWise,

        departmentWise,

        last7Days,
    };

};