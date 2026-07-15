"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const data = [
    { day: "Mon", present: 1180 },
    { day: "Tue", present: 1198 },
    { day: "Wed", present: 1202 },
    { day: "Thu", present: 1192 },
    { day: "Fri", present: 1211 },
    { day: "Sat", present: 1104 },
];

export default function AttendanceTrendChart() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">
                Attendance Trend
            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <Tooltip />

                    <Bar
                        dataKey="present"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}