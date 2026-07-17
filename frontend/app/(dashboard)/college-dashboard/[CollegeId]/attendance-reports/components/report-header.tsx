"use client";

import { CalendarDays, Download, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";

import { exportAttendancePdf } from "@/utils/exportAttendancePdf";

import {
    AttendanceReport,
    AttendanceSummary,
} from "@/types/attendance";

interface Props {
    rows: AttendanceReport[];

    summary: AttendanceSummary;

    query: {
        date: string;
        postingPlace?: string;
        section?: string;
    };
}

export default function ReportHeader({
    rows,
    summary,
    query,
}: Props) {

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div className="flex items-start gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                    <CalendarDays className="h-8 w-8 text-blue-700" />
                </div>

                <div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Attendance Reports
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Daily, Weekly, Monthly and Section-wise Attendance Analytics
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-600">
                        <CalendarDays className="h-4 w-4" />
                        {today}
                    </div>

                </div>

            </div>

            {/* Right */}

            <div className="flex flex-wrap gap-3">

                <Button
                    variant="outline"
                    className="h-11 rounded-xl"
                >
                    <FileSpreadsheet className="mr-2 h-5 w-5 text-green-600" />
                    Export Excel
                </Button>

                <Button
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() =>
                        exportAttendancePdf({
                            rows,
                            summary,
                            date: query.date,
                            postingPlace:
                                query.postingPlace ?? "All Posting Places",
                            section:
                                query.section ?? "All Sections",
                            generatedBy: "Super Admin",
                        })
                    }
                >
                    <Download className="mr-2 h-5 w-5 text-red-600" />
                    Export PDF
                </Button>

            </div>

        </div>
    );
}