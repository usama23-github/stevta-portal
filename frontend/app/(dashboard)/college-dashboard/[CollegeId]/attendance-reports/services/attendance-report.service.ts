const API = "https://portal.stevta.gos.pk/api/v1";

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