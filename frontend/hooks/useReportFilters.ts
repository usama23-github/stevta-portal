"use client";

import { useEffect, useState } from "react";
import {
    getPostingPlaces,
    getSections,
    getDesignations,
} from "@/lib/api/attendance";

export function useReportFilters() {
    const [postingPlaces, setPostingPlaces] = useState([]);
    const [sections, setSections] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFilters();
    }, []);

    async function loadFilters() {
        try {
            const [postingRes, sectionRes, designationRes] =
                await Promise.all([
                    getPostingPlaces(),
                    getSections(),
                    getDesignations(),
                ]);

            setPostingPlaces(postingRes.data.result.postingPlaces);
            setSections(sectionRes.data.result.data);
            setDesignations(designationRes.data.result.data);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        postingPlaces,
        sections,
        designations,
    };
}