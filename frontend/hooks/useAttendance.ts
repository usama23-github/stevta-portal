"use client";

import { useEffect, useState } from "react";

import {
    AttendanceQuery,
    getAttendanceReport,
    getAttendanceSummary,
    getAttendanceSectionSummary,
} from "@/services/attendance.service";

import {
    AttendanceReport,
    AttendanceSummary,
    AttendanceSectionSummary,
} from "@/types/attendance";

export function useAttendance(query: AttendanceQuery) {
    const [loading, setLoading] = useState(false);

    const [rows, setRows] = useState<AttendanceReport[]>([]);

    const [summary, setSummary] =
        useState<AttendanceSummary[]>([]);

    const [summarySection, setSummarySection] =
        useState<AttendanceSectionSummary[]>([]);



    const [meta, setMeta] = useState<any>();

    const fetchAttendance = async () => {
        setLoading(true);

        try {
            const [report, stats, sectionSummary] = await Promise.all([
                getAttendanceReport(query),

                getAttendanceSummary(query),

                getAttendanceSectionSummary(query),
            ]);

            setRows(report.data);

            setMeta(report.meta);

            setSummary(stats);

            const singleArray = sectionSummary.flatMap(
                (item: { date: string; sections: any[] }) =>
                    item.sections.map((section: any) => ({
                        date: item.date,
                        ...section,
                    }))
            );

            setSummarySection(singleArray);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [JSON.stringify(query)]);

    return {
        loading,

        rows,

        meta,

        summary,

        summarySection,

        refresh: fetchAttendance,
    };
}