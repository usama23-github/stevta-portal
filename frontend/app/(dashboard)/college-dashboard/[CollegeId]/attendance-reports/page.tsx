"use client";

import { useState } from "react";
import dayjs from "dayjs";

import ReportHeader from "./components/report-header";
import ReportTabs from "./components/report-tabs";
import ReportFilters from "./components/report-filters";
import SummaryCards from "./components/summary-cards";
// import ReportCharts from "./components/report-charts";
import AttendanceTable from "./components/attendance-table";

import { useAttendance } from "@/hooks/useAttendance";

export default function AttendanceReportsPage() {
    const [query, setQuery] = useState({
        page: 1,
        limit: 1000,
        date: dayjs().format("YYYY-MM-DD"),
        search: "",
    });

    const {
        rows,
        loading,
        summary,
        meta,
        refresh,
    } = useAttendance(query);

    return (
        <div className="space-y-6 p-6">
            <ReportHeader />

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

                    {/* <ReportCharts
                        summary={summary}
                    /> */}

                    <AttendanceTable
                        data={rows}
                        loading={loading}
                    />

                </div>
            </div>
        </div>
    );
}