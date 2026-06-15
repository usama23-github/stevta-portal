export interface Staff {
    id: string;
    empNo: string;
    name: string;
    designation: string;
    department: string;
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
        `${process.env.NEXT_PUBLIC_API_URL}/staff?${params}`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch staff");
    }

    return result.result;
}