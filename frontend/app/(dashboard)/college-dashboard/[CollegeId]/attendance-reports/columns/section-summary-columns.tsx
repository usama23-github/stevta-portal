import { AttendanceSectionSummary } from "@/types/attendance";
import { TableColumn } from "../types/table";

export const sectionSummaryColumns: TableColumn<AttendanceSectionSummary>[] = [
    {
        id: "sr",
        header: "#",
        cell: (_, index) => index + 1,
    },
    {
        id: "section",
        header: "Section",
        cell: (row) => row.section ?? "No Section",
    },
    {
        id: "totalStaff",
        header: "Total Staff",
        cell: (row) => row.totalStaff ?? 0,
    },
    {
        id: "present",
        header: "Present",
        cell: (row) => row.present ?? 0,
    },
    {
        id: "absent",
        header: "Absent",
        cell: (row) => row.absent ?? 0,
    },
    {
        id: "late",
        header: "Late",
        cell: (row) => row.late ?? 0,
    },
    {
        id: "earlyCheckout",
        header: "Early Out",
        cell: (row) => row.earlyCheckout ?? 0,
    },
    {
        id: "notMarked",
        header: "Not Marked",
        cell: (row) => row.notMarked ?? 0,
    },
    {
        id: "attendancePercentage",
        header: "Attendance %",
        cell: (row) =>
            `${Number(row.attendancePercentage ?? 0).toFixed(1)}%`,
    },
];