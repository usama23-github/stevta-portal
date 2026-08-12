"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Eye,
} from "lucide-react";

import { getLeaveTypes, LeaveTypesRecord } from "@/lib/api/leaves";

export default function page() {

    const [loading, setLoading] = useState(true);

    const [leaves, setLeaves] = useState<LeaveTypesRecord[]>([]);

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalLeaves, setTotalLeaves] = useState(0);

    const [showRecords, setShowRecords] = useState(0);

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async (
        pageNumber = page
    ) => {
        try {
            setLoading(true);

            const result = await getLeaveTypes(
                pageNumber,
                10
            );

            setLeaves(result.data);

            setTotalPages(result.meta.totalPages);

            setTotalLeaves(result.meta.total);

            setShowRecords(result.data.length);

        } catch (error) {
            console.error(
                "Leave Management Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD / PAGINATION
    // =====================================================

    useEffect(() => {
        loadData(page);
    }, [page]);

    return (
        <div className="mt-8 rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-5 border-b border-[#e2e8f0] p-6">
                <div className="flex flex-col gap-4 border-b border-[#e2e8f0] p-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* TITLE */}

                    <div>

                        <h2 className="text-2xl font-bold text-[#0f172a]">
                            Leave Types
                        </h2>

                    </div>



                </div>
            </div>

            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="overflow-x-auto">

                {loading ? (

                    <div className="p-10 text-center">

                        <p className="text-[#64748b]">
                            Loading leave type records...
                        </p>

                    </div>

                ) : (

                    <table className="w-full min-w-[1300px]">

                        {/* TABLE HEADER */}

                        <thead className="bg-[#f8fafc]">

                            <tr>

                                {[
                                    "S no",
                                    "Leave Type",
                                    "Description"
                                ].map((heading) => (

                                    <th
                                        key={heading}
                                        className="border-b border-[#e2e8f0] px-6 py-4 text-left text-sm font-semibold text-[#334155]"
                                    >
                                        {heading}
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        {/* TABLE BODY */}

                        <tbody>

                            {leaves.map((record) => (

                                <tr
                                    key={record.id}
                                    className="transition hover:bg-[#f8fafc]"
                                >



                                    {/* DESIGNATION */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">

                                        1

                                    </td>

                                    {/* LEAVE TYPE */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">

                                            <CalendarDays className="h-4 w-4" />

                                            {record.name}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            {/* EMPTY */}

                            {leaves.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={10}
                                        className="px-6 py-16 text-center text-[#64748b]"
                                    >

                                        No leave types records found.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* ================================================= */}
            {/* FOOTER / PAGINATION */}
            {/* ================================================= */}

            {!loading && (

                <>

                    <div className="flex flex-col gap-4 border-t border-[#e2e8f0] p-6 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-[#64748b]">

                            Showing{" "}

                            <span className="font-semibold text-[#0f172a]">
                                {showRecords}
                            </span>{" "}

                            of{" "}

                            <span className="font-semibold text-[#0f172a]">
                                {totalLeaves}
                            </span>{" "}

                            records

                        </p>

                        {/* DESKTOP PAGINATION */}

                        <div className="hidden items-center gap-2 md:flex">

                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(
                                        (prev) => prev - 1
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <ChevronLeft className="h-4 w-4" />

                            </button>

                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => (

                                    <button
                                        key={index}
                                        onClick={() =>
                                            setPage(index + 1)
                                        }
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${page === index + 1
                                            ? "bg-[#2563eb] text-white"
                                            : "border border-[#dbe4f0] bg-white text-[#334155] hover:bg-[#f8fafc]"
                                            }`}
                                    >

                                        {index + 1}

                                    </button>

                                )
                            )}

                            <button
                                disabled={
                                    page === totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) => prev + 1
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <ChevronRight className="h-4 w-4" />

                            </button>

                        </div>

                    </div>

                    {/* MOBILE PAGINATION */}

                    <div className="space-y-4 px-4 pb-4 md:hidden">

                        <div className="flex items-center justify-between">

                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(
                                        (prev) => prev - 1
                                    )
                                }
                            >
                                Previous
                            </Button>

                            <p className="text-sm text-[#64748b]">

                                Page{" "}

                                <span className="font-semibold text-[#0f172a]">
                                    {page}
                                </span>{" "}

                                of{" "}

                                <span className="font-semibold text-[#0f172a]">
                                    {totalPages}
                                </span>

                            </p>

                            <Button
                                variant="outline"
                                disabled={
                                    page === totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) => prev + 1
                                    )
                                }
                            >
                                Next
                            </Button>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}