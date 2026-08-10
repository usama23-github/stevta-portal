export interface Staff {
    id: string;
    empNo: string;
    employeeName: string;
    designation: string;
    department: string;
    postingPlace: string;
    section: string;
    createdAt: string;
    updatedAt: string;
}

export interface StaffResponse {
    data: Staff[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getAllStaff(
    page = 1,
    limit = 10,
    search = ""
): Promise<StaffResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search.trim()) {
        params.append("search", search);
    }

    const response = await fetch(
        `https://portal.stevta.gos.pk/api/v1/staff?${params}`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch staff");
    }

    return result;
}