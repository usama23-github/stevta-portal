export interface AttendanceReport {
    empNo: string;

    employeeName: string;

    designation: string | null;

    postingPlace: string | null;

    section: string | null;

    department: string | null;

    attendanceStatusId: number;

    attendanceStatus: string;

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
    totalStaff: number;

    present: number;

    absent: number;

    late: number;

    earlyCheckout: number;

    notMarked: number;
}