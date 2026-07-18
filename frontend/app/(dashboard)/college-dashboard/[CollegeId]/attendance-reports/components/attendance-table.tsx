"use client";

import React from "react";

export interface TableColumn<T> {
    id: string;
    header: string;
    cell: (row: T, index: number) => React.ReactNode;
    textColor?: string;
}

interface AttendanceTableProps<T> {
    title?: string;
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
}

export default function AttendanceTable<T>({
    title = "Attendance Report",
    data,
    columns,
    loading = false,
}: AttendanceTableProps<T>) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>

                <span className="text-sm text-slate-500">
                    {loading ? "Loading..." : `${data.length} Record(s)`}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-sky-900 text-white">
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    className="px-4 py-3 text-left text-sm font-semibold"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-10 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-10 text-center"
                                >
                                    No Records Found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-slate-50"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.id}
                                            className={`px-4 py-3 font-medium ${column?.textColor}`}
                                        >
                                            {column.cell(row, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}