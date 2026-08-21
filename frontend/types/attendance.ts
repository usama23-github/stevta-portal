export interface AttendanceReport {
    empNo: string;

    employeeName: string;

    designation: string | null;

    postingPlace: string | null;

    section: string | null;

    department: string | null;

    attendanceStatusId: number;

    attendanceStatus: string;

    leaveType: string | null;

    checkIn: string | null;

    checkInStatusId: number | null;

    checkInStatus: string | null;

    checkOut: string | null;

    checkOutStatusId: number | null;

    checkOutStatus: string | null;

    workingHours: string | null;

    date: string;
}

export interface AttendanceSummary {
    date: string;

    totalStaff: number;

    present: number;

    absent: number;

    late: number;

    earlyCheckout: number;

    notMarked: number;

    attendancePercentage: number;
}

export interface AttendanceSectionSummary {
    date: string | null;
    sectionId: number | null;
    section: string | null;
    totalStaff: number | null;
    present: number | null;
    absent: number | null;
    late: number | null;
    earlyCheckout: number | null;
    notMarked: number | null;
    attendancePercentage: number | null;
}