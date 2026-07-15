"use client";

import { columns } from "./attendance-columns";
import AttendanceStatusBadge from "./attendance-status-badge";

const data = [
    {
        empNo: "104255",
        employeeName: "Ali Khan",
        designation: "Assistant (BPS-16)",
        section: "HR",
        postingPlace: "Head Office",
        attendanceStatus: 1,
        checkIn: "08:28:10 AM",
        checkOut: "05:09:42 PM",
        checkInStatus: 1,
        checkOutStatus: 1,
        workingHours: "8h 41m",
    },
];

export default function AttendanceTable() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Attendance Report
                </h2>

                <span className="text-sm text-slate-500">
                    {data.length} Record(s)
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            {columns.map((column) => (
                                <th
                                    key={column.id ?? String(column.accessorKey)}
                                    className="px-4 py-3 text-left text-sm font-semibold"
                                >
                                    {String(column.header)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.empNo}
                                className="border-b hover:bg-slate-50"
                            >
                                <td className="px-4 py-3">{row.empNo}</td>
                                <td className="px-4 py-3">{row.employeeName}</td>
                                <td className="px-4 py-3">{row.designation}</td>
                                <td className="px-4 py-3">{row.section}</td>
                                <td className="px-4 py-3">{row.postingPlace}</td>

                                <td className="px-4 py-3">
                                    <AttendanceStatusBadge status={row.attendanceStatus} />
                                </td>

                                <td className="px-4 py-3">{row.checkIn}</td>
                                <td className="px-4 py-3">{row.checkOut}</td>
                                <td className="px-4 py-3">{row.workingHours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}