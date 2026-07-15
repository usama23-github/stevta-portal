"use client";

import { columns } from "./attendance-columns";
import AttendanceStatusBadge from "./attendance-status-badge";
import { AttendanceReport } from "@/types/attendance";

interface AttendanceTableProps {
    data: AttendanceReport[];
    loading?: boolean;
}

export default function AttendanceTable({
    data,
    loading = false,
}: AttendanceTableProps) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Attendance Report
                </h2>

                <span className="text-sm text-slate-500">
                    {loading ? "Loading..." : `${data.length} Record(s)`}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            {data?.length !== 0 && columns?.map((column) => (
                                <th
                                    key={column?.id}
                                    className="px-4 py-3 text-left text-sm font-semibold"
                                >
                                    {String(column.header)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-10 text-center text-slate-500"
                                >
                                    Loading attendance...
                                </td>
                            </tr>
                        ) : data?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-10 text-center text-slate-500"
                                >
                                    No attendance found.
                                </td>
                            </tr>
                        ) : (
                            data?.map((row, index) => (
                                <tr
                                    key={`${row.empNo}-${row.date}`}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{row.empNo}</td>

                                    <td className="px-4 py-3">
                                        {row.employeeName}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.designation ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.section ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.date ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        <AttendanceStatusBadge
                                            status={row.attendanceStatusId}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.checkIn ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.checkOut ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.workingHours ?? "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}