"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttendanceReport } from "../types";

import AttendanceStatusBadge from "./attendance-status-badge";

export const columns: ColumnDef<AttendanceReport>[] = [
    {
        accessorKey: "",
        header: "S no",
    },
    {
        accessorKey: "empNo",
        header: "Emp No",
    },
    {
        accessorKey: "employeeName",
        header: "Employee",
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "section",
        header: "Section",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "attendanceStatus",
        header: "Attendance",

        cell: ({ row }) => (
            <AttendanceStatusBadge
                status={row.original.attendanceStatus}
            />
        ),
    },
    {
        accessorKey: "checkIn",
        header: "Check In",
    },
    {
        accessorKey: "checkOut",
        header: "Check Out",
    },
    {
        accessorKey: "workingHours",
        header: "Working Hours",
    },
];