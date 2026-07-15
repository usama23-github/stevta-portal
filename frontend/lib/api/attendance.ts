export interface StaffAttendance {
    empNo: string;
    employeeName: string;
    designation: string;
    section: string;
    date: string;
    attendanceStatus: number;
    checkIn: string;
    checkInStatus: number;
    checkOut: string;
    checkOutStatus: number;
    workingHours: string;
}

export interface StaffAttendanceResponse {
    data: StaffAttendance[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getStaffAttendance(
    page = 1,
    limit = 10,
    search = "",
    attendanceStatusId = "",
    date = "",
    checkInStatusId = "",
): Promise<StaffAttendanceResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search.trim()) {
        params.append("search", search);
    }

    if (attendanceStatusId.trim()) {
        params.append("attendanceStatusId", attendanceStatusId);
    }

    if (date.trim()) {
        params.append("date", date);
    }

    if (checkInStatusId.trim()) {
        params.append("checkInStatusId", checkInStatusId);
    }

    const response = await fetch(
        `https://portal.stevta.gos.pk/api/v1/attendance?${params}`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch attendance");
    }

    return result.result;
}