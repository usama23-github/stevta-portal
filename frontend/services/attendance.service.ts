import axios from "axios";

const api = axios.create({
    baseURL: "https://portal.stevta.gos.pk/api/v1",
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
    params: AttendanceQuery
) => {
    const response = await api.get("/attendance/summary", {
        params,
    });

    return response.data.result;
};

export const getAttendanceSectionSummary = async (
    date?: string
) => {
    const response = await api.get("/attendance/report/section-summary", {
        params: {
            date,
        },
    });

    return response.data.result;
};