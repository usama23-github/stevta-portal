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

async function compressPdf(file: File): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
    });

    // Remove unnecessary metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);

    const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
    });

    // Create a proper ArrayBuffer for Blob/File
    const buffer = new ArrayBuffer(compressedBytes.byteLength);

    new Uint8Array(buffer).set(compressedBytes);

    return new File(
        [buffer],
        file.name,
        {
            type: "application/pdf",
        }
    );
}

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

    const handleNotificationFile = async (
        file: File
    ) => {
        // PDF validation
        if (file.type !== "application/pdf") {
            alert("Please select a PDF file.");
            return;
        }

        // Maximum original file size: 20 MB
        if (file.size > 20 * 1024 * 1024) {
            alert("PDF must be less than 20 MB.");
            return;
        }

        try {
            setCompressingPdf(true);

            const originalSize = file.size;

            const compressedFile =
                await compressPdf(file);

            const compressedSize =
                compressedFile.size;

            console.log(
                `Original PDF: ${(originalSize / 1024 / 1024).toFixed(2)} MB`
            );

            console.log(
                `Compressed PDF: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`
            );

            // If compression makes the file larger,
            // keep the original file.
            const finalFile =
                compressedSize < originalSize
                    ? compressedFile
                    : file;

            // Final uploaded file must be <= 5 MB
            if (
                finalFile.size >
                5 * 1024 * 1024
            ) {
                alert(
                    "The PDF is still larger than 5 MB after compression. Please select a smaller PDF."
                );

                setNotificationFile(null);
                return;
            }

            setNotificationFile(finalFile);

        } catch (error) {

            console.error(
                "PDF compression error:",
                error
            );

            alert(
                "Unable to process the PDF. Please try another file."
            );

            setNotificationFile(null);

        } finally {
            setCompressingPdf(false);
        }
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

            {showMarkLeave && (
                <div className="fixed inset-0 z-[9999] bg-black/50">

                    {/* MODAL CONTAINER */}
                    <div className="flex h-full w-full items-center justify-center p-3 sm:p-6">

                        <div className="flex h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

                            {/* ============================= */}
                            {/* HEADER */}
                            {/* ============================= */}

                            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                        <CalendarPlus className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                                            Mark Leave
                                        </h2>

                                        <p className="text-xs text-slate-500 sm:text-sm">
                                            Mark leave for a staff member
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowMarkLeave(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* ============================= */}
                            {/* SCROLLABLE BODY */}
                            {/* ============================= */}

                            <div className="min-h-0 flex-1 overflow-y-auto">

                                <div className="space-y-5 p-5 sm:p-6">

                                    {/* EMPLOYEE */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Employee
                                        </label>

                                        <div className="relative">

                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="text"
                                                value={employeeSearch}
                                                onChange={(e) => {
                                                    setEmployeeSearch(e.target.value);
                                                    setSelectedEmployee(null);
                                                    setShowEmployeeResults(true);
                                                }}
                                                onFocus={() => {
                                                    setShowEmployeeResults(true);
                                                }}
                                                placeholder="Search by name or employee number..."
                                                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                            {selectedEmployee && (
                                                <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                                            )}

                                            {/* EMPLOYEE SEARCH RESULTS */}

                                            {showEmployeeResults &&
                                                employeeSearch.length >= 2 && (
                                                    <div className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">

                                                        {employeeLoading ? (

                                                            <div className="p-4 text-center text-sm text-slate-500">
                                                                Searching employees...
                                                            </div>

                                                        ) : employees.length === 0 ? (

                                                            <div className="p-4 text-center text-sm text-slate-500">
                                                                No employees found
                                                            </div>

                                                        ) : (

                                                            employees.map((employee) => (

                                                                <button
                                                                    key={employee.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedEmployee(employee);

                                                                        setEmployeeSearch(
                                                                            `${employee.name} (${employee.empNo})`
                                                                        );

                                                                        setShowEmployeeResults(false);
                                                                    }}
                                                                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-blue-50"
                                                                >

                                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                                                        {employee.name.charAt(0)}
                                                                    </div>

                                                                    <div className="min-w-0">

                                                                        <p className="truncate text-sm font-semibold text-slate-800">
                                                                            {employee.name}
                                                                        </p>

                                                                        <p className="text-xs text-slate-500">
                                                                            {employee.empNo}
                                                                            {" • "}
                                                                            {employee.designation?.designation || "N/A"}
                                                                        </p>

                                                                        <p className="text-xs text-slate-400">
                                                                            {employee.section?.section || "N/A"}
                                                                        </p>

                                                                    </div>

                                                                </button>

                                                            ))

                                                        )}

                                                    </div>
                                                )}

                                        </div>

                                        {/* SELECTED EMPLOYEE */}

                                        {selectedEmployee && (

                                            <div className="mt-2 rounded-xl bg-green-50 px-4 py-3">

                                                <div className="flex items-center justify-between">

                                                    <div>

                                                        <p className="text-sm font-semibold text-green-800">
                                                            {selectedEmployee.name}
                                                        </p>

                                                        <p className="text-xs text-green-600">
                                                            Employee No: {selectedEmployee.empNo}
                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedEmployee(null);
                                                            setEmployeeSearch("");
                                                        }}
                                                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                                                    >
                                                        Change
                                                    </button>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                    {/* LEAVE TYPE */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Leave Type
                                        </label>

                                        <select
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >

                                            <option value="">
                                                Select Leave Type
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

                                    {/* DATES */}

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                From Date
                                            </label>

                                            <input
                                                type="date"
                                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                To Date
                                            </label>

                                            <input
                                                type="date"
                                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                    </div>

                                    {/* REASON */}

                                    {/* <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Reason
                                        </label>

                                        <textarea
                                            rows={4}
                                            placeholder="Enter reason for leave..."
                                            className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div> */}

                                    {/* PDF NOTIFICATION */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Leave Notification
                                            <span className="ml-2 text-xs font-normal text-slate-400">
                                                (Optional)
                                            </span>
                                        </label>

                                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5">

                                            <div className="flex flex-col items-center justify-center text-center">

                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                                                    <FileText className="h-6 w-6 text-red-500" />
                                                </div>

                                                <p className="text-sm font-semibold text-slate-700">
                                                    Attach Leave Notification
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    PDF only • Maximum 5 MB • Optional
                                                </p>

                                                {/* <label className="mt-4 cursor-pointer">

                                                    <span className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50">
                                                        Choose PDF
                                                    </span>

                                                    <input
                                                        type="file"
                                                        accept="application/pdf,.pdf"
                                                        className="hidden"
                                                        disabled={compressingPdf}
                                                        onChange={(e) => {

                                                            const file = e.target.files?.[0];

                                                            if (!file) {
                                                                setNotificationFile(null);
                                                                return;
                                                            }

                                                            handleNotificationFile(file);

                                                            e.target.value = "";
                                                        }}
                                                    />

                                                </label> */}

                                                {compressingPdf ? (

                                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600">

                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                                                        Compressing PDF...

                                                    </div>

                                                ) : (

                                                    <label className="mt-4 cursor-pointer">

                                                        <span className="inline-flex h-10 items-center rounded-xl bg-white px-4 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50">
                                                            Choose PDF
                                                        </span>

                                                        <input
                                                            type="file"
                                                            accept="application/pdf,.pdf"
                                                            className="hidden"
                                                            disabled={compressingPdf}
                                                            onChange={(e) => {

                                                                const file =
                                                                    e.target.files?.[0];

                                                                if (!file) {
                                                                    setNotificationFile(null);
                                                                    return;
                                                                }

                                                                handleNotificationFile(file);

                                                                // Allow selecting the same file again
                                                                e.target.value = "";

                                                            }}
                                                        />

                                                    </label>

                                                )}

                                                {notificationFile && !compressingPdf && (

                                                    <div className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-4">

                                                        <div className="flex items-center justify-between gap-3">

                                                            <div className="flex min-w-0 items-center gap-3">

                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                                                                    <FileText className="h-5 w-5 text-red-500" />
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="truncate text-sm font-semibold text-slate-700">
                                                                        {notificationFile.name}
                                                                    </p>

                                                                    <p className="text-xs text-green-600">
                                                                        Compressed •{" "}
                                                                        {(
                                                                            notificationFile.size /
                                                                            1024 /
                                                                            1024
                                                                        ).toFixed(2)}{" "}
                                                                        MB
                                                                    </p>

                                                                </div>

                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setNotificationFile(null)
                                                                }
                                                                className="shrink-0 text-xs font-semibold text-red-500 hover:text-red-700"
                                                            >
                                                                Remove
                                                            </button>

                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* ============================= */}
                            {/* FIXED FOOTER */}
                            {/* ============================= */}

                            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 rounded-xl px-5"
                                    onClick={() =>
                                        setShowMarkLeave(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    className="h-10 rounded-xl bg-blue-600 px-6 hover:bg-blue-700"
                                    onClick={() => {
                                        // Submit API
                                    }}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark Leave
                                </Button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}