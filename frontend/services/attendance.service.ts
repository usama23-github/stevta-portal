import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export interface AttendanceQuery {
    page?: number;
    limit?: number;
    search?: string;

    date?: string;

    attendanceStatusId?: number;

    checkInStatusId?: number;

    postingPlaceId?: number;

    sectionId?: number;

    designationId?: number;

    sortField?: string;

    sortOrder?: "asc" | "desc";
}

export const getAttendanceReport = async (
    params: AttendanceQuery
) => {
    const response = await api.get("/attendance/report", {
        params,
    });

    return response.data.result;
};

export const getAttendanceSummary = async (
    date?: string
) => {
    const response = await api.get("/attendance/summary", {
        params: {
            date,
        },
    });

    return response.data.result;
};