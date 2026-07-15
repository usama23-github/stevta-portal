"use client";

import { useEffect, useState } from "react";

import {
    AttendanceQuery,
    getAttendanceReport,
    getAttendanceSummary,
} from "@/services/attendance.service";

import {
    AttendanceReport,
    AttendanceSummary,
} from "@/types/attendance";

export function useAttendance(query: AttendanceQuery) {
    const [loading, setLoading] = useState(false);

    const [rows, setRows] = useState<AttendanceReport[]>([]);

    const [summary, setSummary] =
        useState<AttendanceSummary>();

    const [meta, setMeta] = useState<any>();

    const fetchAttendance = async () => {
        setLoading(true);

        try {
            const [report, stats] = await Promise.all([
                getAttendanceReport(query),

                getAttendanceSummary(query.date),
            ]);

            setRows(report.data);

            setMeta(report.meta);

            setSummary(stats);
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

        refresh: fetchAttendance,
    };
}