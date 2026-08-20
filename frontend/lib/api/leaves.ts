export interface LeaveRecord {
    id: string;

    fromDate: string;
    toDate: string;

    totalDays: number;

    appliedAt: string;

    approvedAt: string | null;
    rejectedAt: string | null;

    staff: {
        id: string;
        empNo: string;
        name: string;

        designation: string;
        section: string;
    };

    designation: {
        designation: string;
    }

    section: {
        section: string;
    }

    leaveType: {
        id: number;
        name: string;
    };
}

export interface LeaveTypesRecord {
    id: string;

    name: string;

}

interface LeaveResponse {
    success: boolean;

    data: LeaveRecord[];

    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface LeaveTypesResponse {
    success: boolean;

    data: LeaveTypesRecord[];

    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getLeaves = async (
    page = 1,
    limit = 10,
    search = "",
    status = "",
    leaveTypeId = ""
) => {

    const params = new URLSearchParams();

    params.append(
        "page",
        page.toString()
    );

    params.append(
        "limit",
        limit.toString()
    );

    if (search) {
        params.append("search", search);
    }

    if (status) {
        params.append("status", status);
    }

    if (leaveTypeId) {
        params.append(
            "leaveTypeId",
            leaveTypeId
        );
    }

    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://portal.stevta.gos.pk/api/v1";

    const response = await fetch(
        `${apiUrl}/leave?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch leave records"
        );
    }

    const result: LeaveResponse =
        await response.json();

    return result;
};

export const getLeaveTypes = async (
    page = 1,
    limit = 10
) => {

    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://portal.stevta.gos.pk/api/v1";

    const response = await fetch(
        `${apiUrl}/leave/types`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch leave type records"
        );
    }

    const result: LeaveTypesResponse =
        await response.json();

    return result;
};