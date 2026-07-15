"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const data = [
    {
        name: "Finance",
        value: 180,
    },
    {
        name: "HR",
        value: 120,
    },
    {
        name: "Training",
        value: 280,
    },
    {
        name: "Administration",
        value: 150,
    },
    {
        name: "Academics",
        value: 310,
    },
];

const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
];

export default function SectionAttendanceChart() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">
                Section Wise Attendance
            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={110}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}