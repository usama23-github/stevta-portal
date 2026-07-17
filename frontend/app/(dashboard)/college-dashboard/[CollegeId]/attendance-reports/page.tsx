"use client";

import { useState } from "react";
import dayjs from "dayjs";

import ReportHeader from "./components/report-header";
import ReportTabs from "./components/report-tabs";
import ReportFilters from "./components/report-filters";
import SummaryCards from "./components/summary-cards";
// import ReportCharts from "./components/report-charts";
import AttendanceTable from "./components/attendance-table";
import { attendanceColumns } from "./columns/attendance-columns";
import { sectionSummaryColumns } from "./columns/section-summary-columns";

import { useAttendance } from "@/hooks/useAttendance";

export default function AttendanceReportsPage() {

    const [query, setQuery] = useState({
        page: 1,
        limit: 1000,
        fromDate: dayjs().format("YYYY-MM-DD"),
        toDate: dayjs().format("YYYY-MM-DD"),
        search: "",
        postingPlace: "",
        section: "",
    });

    const {
        rows,
        loading,
        summary,
        summarySection,
        meta,
        refresh,
    } = useAttendance(query);

    return (
        <div className="space-y-6 p-6">
            {summary && (
                <ReportHeader
                    rows={rows}
                    summary={summary}
                    query={query}
                />
            )}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <ReportTabs />

                <div className="space-y-6 border-t p-6">

                    <ReportFilters
                        query={query}
                        setQuery={setQuery}
                    />

                    <SummaryCards
                        summary={summary}
                        loading={loading}
                    />

                    <AttendanceTable
                        title="Section Wise Summary"
                        data={summarySection}
                        columns={sectionSummaryColumns}
                        loading={loading}
                    />

                    <AttendanceTable
                        title="Daily Attendance"
                        data={rows}
                        columns={attendanceColumns}
                        loading={loading}
                    />

                    {/* <ReportCharts
                        summary={summary}
                    /> */}

                </div>
            </div>
        </div>
    );
}