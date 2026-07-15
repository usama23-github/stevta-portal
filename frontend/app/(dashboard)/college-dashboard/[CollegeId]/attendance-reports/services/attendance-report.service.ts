const API =
    process.env.NEXT_PUBLIC_API_URL;

export async function getAttendanceReport(
    params: URLSearchParams
) {

    const res = await fetch(

        `${API}/attendance/report?${params.toString()}`,

        {
            credentials: "include",
        }

    );

    if (!res.ok)
        throw new Error("Failed to fetch");

    const json = await res.json();

    return json.result;
}