import { AttendanceReport } from "@/types/attendance";
import { TableColumn } from "../types/table";
import AttendanceStatusBadge from "../components/attendance-status-badge";

export const attendanceColumns: TableColumn<AttendanceReport>[] = [
    {
        id: "sr",
        header: "#",
        cell: (_, index) => index + 1,
    },
    {
        id: "empNo",
        header: "Employee No",
        cell: (row) => row.empNo,
    },
    {
        id: "name",
        header: "Employee Name",
        cell: (row) => row.employeeName,
    },
    {
        id: "designation",
        header: "Designation",
        cell: (row) => row.designation ?? "-",
    },
    {
        id: "section",
        header: "Section",
        cell: (row) => row.section ?? "-",
    },
    {
        id: "date",
        header: "Date",
        cell: (row) => row.date,
    },
    {
        id: "status",
        header: "Status",
        cell: (row) => (
            <AttendanceStatusBadge
                status={row.attendanceStatusId}
            />
        ),
    },
    {
        id: "checkIn",
        header: "Check In",
        cell: (row) => row.checkIn ?? "-",
    },
    {
        id: "checkOut",
        header: "Check Out",
        cell: (row) => row.checkOut ?? "-",
    },
    {
        id: "workingHours",
        header: "Working Hours",
        cell: (row) => row.workingHours ?? "-",
    },
];