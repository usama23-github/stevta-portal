"use client";

import { useEffect, useState } from "react";

import { getAttendanceReport } from "../services/attendance-report.service";

export default function useAttendanceReport(
    params: URLSearchParams
) {

    const [loading, setLoading] =
        useState(true);

    const [data, setData] =
        useState([]);

    const [meta, setMeta] =
        useState();

    useEffect(() => {

        load();

    }, [params.toString()]);

    async function load() {

        setLoading(true);

        try {

            const result =
                await getAttendanceReport(params);

            setData(result.data);

            setMeta(result.meta);

        }

        finally {

            setLoading(false);

        }

    }

    return {

        loading,

        data,

        meta,

    };

}