"use client";

import { Button } from "@/components/ui/button";

import { PDFDocument } from "pdf-lib";

import { useEffect, useState } from "react";

import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    CalendarDays,
    CalendarPlus,
    CheckCircle2,
    XCircle,
    Clock3,
    Eye,
    FileText,
} from "lucide-react";

import { getLeaves, LeaveRecord } from "@/lib/api/leaves";

export default function LeaveManagement() {
    const [employeeSearch, setEmployeeSearch] =
        useState("");

    const [employees, setEmployees] = useState<any[]>([]);

    const [notificationFile, setNotificationFile] =
        useState<File | null>(null);

    const [selectedEmployee, setSelectedEmployee] =
        useState<any>(null);

    const [employeeLoading, setEmployeeLoading] =
        useState(false);

    const [showEmployeeResults, setShowEmployeeResults] =
        useState(false);
    const [showMarkLeave, setShowMarkLeave] =
        useState(false);

    const [loading, setLoading] = useState(true);

    const [leaves, setLeaves] = useState<LeaveRecord[]>([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [leaveTypeFilter, setLeaveTypeFilter] =
        useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalLeaves, setTotalLeaves] = useState(0);

    const [showRecords, setShowRecords] = useState(0);

    const [compressingPdf, setCompressingPdf] =
        useState(false);

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async (
        pageNumber = page,
        searchValue = search,
        status = statusFilter,
        leaveType = leaveTypeFilter
    ) => {
        try {
            setLoading(true);

            const result = await getLeaves(
                pageNumber,
                10,
                searchValue,
                status,
                leaveType
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

    useEffect(() => {

        if (employeeSearch.length < 2) {
            setEmployees([]);
            return;
        }

        // Don't search again after selecting an employee
        if (selectedEmployee) {
            return;
        }

        const timer = setTimeout(async () => {

            try {

                setEmployeeLoading(true);

                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:5000";

                const response = await fetch(
                    `${apiUrl}/api/staff/search?search=${encodeURIComponent(
                        employeeSearch
                    )}&limit=20`
                );

                const result = await response.json();

                setEmployees(result.data || []);

            } catch (error) {

                console.error(
                    "Employee search error:",
                    error
                );

                setEmployees([]);

            } finally {

                setEmployeeLoading(false);

            }

        }, 400);

        return () => clearTimeout(timer);

    }, [employeeSearch, selectedEmployee]);

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = async (
        searchValue: string
    ) => {
        setPage(1);

        loadData(
            1,
            searchValue,
            statusFilter,
            leaveTypeFilter
        );
    };

    // =====================================================
    // STATUS FILTER
    // =====================================================

    const handleStatusChange = async (
        status: string
    ) => {
        setPage(1);

        loadData(
            1,
            search,
            status,
            leaveTypeFilter
        );
    };

    // =====================================================
    // LEAVE TYPE FILTER
    // =====================================================

    const handleLeaveTypeChange = async (
        leaveType: string
    ) => {
        setPage(1);

        loadData(
            1,
            search,
            statusFilter,
            leaveType
        );
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getLeaveStatus = (
        record: LeaveRecord
    ) => {
        if (record.rejectedAt) {
            return "Rejected";
        }

        if (record.approvedAt) {
            return "Approved";
        }

        return "Pending";
    };

    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusBadge = (
        record: LeaveRecord
    ) => {
        const status = getLeaveStatus(record);

        if (status === "Approved") {
            return (
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Approved
                </div>
            );
        }

        if (status === "Rejected") {
            return (
                <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    <XCircle className="h-4 w-4" />
                    Rejected
                </div>
            );
        }

        return (
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                <Clock3 className="h-4 w-4" />
                Pending
            </div>
        );
    };

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
                            Leave Management
                        </h2>

                        <p className="mt-1 text-sm text-[#64748b]">
                            Manage staff leave applications and approvals
                        </p>

                    </div>

                    <Button
                        className="h-11 rounded-xl bg-[#2563eb] px-5 text-white shadow-sm hover:bg-[#1d4ed8]"
                        onClick={() => setShowMarkLeave(true)}
                    >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Mark Leave
                    </Button>



                </div>
                {/* FILTERS */}

                <div>

                    {/* SEARCH */}

                    <div className="mb-4">

                        <div className="relative">

                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);

                                    setPage(1);

                                    if (
                                        e.target.value === ""
                                    ) {
                                        handleSearch("");
                                    }
                                }}
                                className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-24 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                            />

                            <Button
                                className="absolute right-0 h-11 rounded-l-none rounded-r-xl"
                                onClick={() =>
                                    handleSearch(search)
                                }
                            >
                                Search
                            </Button>

                        </div>

                    </div>

                    {/* FILTER ROW */}

                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* STATUS */}

                        <div className="relative">

                            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(
                                        e.target.value
                                    );

                                    handleStatusChange(
                                        e.target.value
                                    );
                                }}
                                className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="">
                                    All Leave Status
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="approved">
                                    Approved
                                </option>

                                <option value="rejected">
                                    Rejected
                                </option>

                            </select>

                        </div>

                        {/* LEAVE TYPE */}

                        <div className="relative">

                            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                            <select
                                value={leaveTypeFilter}
                                onChange={(e) => {
                                    setLeaveTypeFilter(
                                        e.target.value
                                    );

                                    handleLeaveTypeChange(
                                        e.target.value
                                    );
                                }}
                                className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="">
                                    All Leave Types
                                </option>

                                <option value="1">
                                    Casual Leave
                                </option>

                                <option value="2">
                                    Medical Leave
                                </option>

                                <option value="3">
                                    Earned Leave
                                </option>

                            </select>

                        </div>

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
                            Loading leave records...
                        </p>

                    </div>

                ) : (

                    <table className="w-full min-w-[1300px]">

                        {/* TABLE HEADER */}

                        <thead className="bg-[#f8fafc]">

                            <tr>

                                {[
                                    "Staff Name",
                                    "Designation",
                                    "Section",
                                    "Leave Type",
                                    "From Date",
                                    "To Date",
                                    "Total Days",
                                    "Applied At",
                                    "Status",
                                    "Action",
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

                                    {/* STAFF */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] font-semibold text-[#2563eb]">
                                                {record.staff.name.charAt(0)}
                                            </div>

                                            <div>

                                                <p className="font-semibold text-[#0f172a]">
                                                    {record.staff.name}
                                                </p>

                                                <p className="text-xs text-[#64748b]">
                                                    Staff ID #{record.staff.empNo}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* DESIGNATION */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">

                                        {record.staff.designation}

                                    </td>

                                    {/* SECTION */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">

                                        {record.staff.section}

                                    </td>

                                    {/* LEAVE TYPE */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">

                                            <CalendarDays className="h-4 w-4" />

                                            {record.leaveType.name}

                                        </div>

                                    </td>

                                    {/* FROM */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">

                                        {record.fromDate}

                                    </td>

                                    {/* TO */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">

                                        {record.toDate}

                                    </td>

                                    {/* TOTAL DAYS */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">

                                            {record.totalDays} Days

                                        </div>

                                    </td>

                                    {/* APPLIED */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">

                                        {record.appliedAt}

                                    </td>

                                    {/* STATUS */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        {getStatusBadge(record)}

                                    </td>

                                    {/* ACTION */}

                                    <td className="border-b border-[#f1f5f9] px-6 py-4">

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl"
                                            onClick={() => {
                                                console.log(
                                                    "View Leave:",
                                                    record.id
                                                );
                                            }}
                                        >

                                            <Eye className="mr-2 h-4 w-4" />

                                            View

                                        </Button>

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

                                        No leave records found.

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