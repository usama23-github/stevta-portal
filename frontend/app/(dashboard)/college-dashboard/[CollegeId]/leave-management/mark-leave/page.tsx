"use client";

import { useEffect, useState } from "react";

import {
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    Loader2,
    Search,
    User,
    X,
} from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";


// ======================================================
// API
// ======================================================

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://portal.stevta.gos.pk/api";


// ======================================================
// TYPES
// ======================================================

type Designation = {
    id: number;
    designation: string;
    scale: {
        scale: string;
    }
};

type Section = {
    id: number;
    section: string;
};

type Department = {
    id: number;
    department: string;
};

type LeaveType = {
    id: number;
    name: string;
};

type Employee = {
    id: string;
    empNo: string;
    employeeName: string;

    designation?: {
        id: number;
        designation: string;
    } | null;

    section?: {
        id: number;
        section: string;
    } | null;

    postingPlace?: {
        id: number;
        postingPlace: string;
    } | null;
};

type EmployeeMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};


// ======================================================
// PAGE
// ======================================================

export default function MarkLeavePage() {

    // ====================================================
    // EMPLOYEE DROPDOWN
    // ====================================================

    const [employeeOpen, setEmployeeOpen] =
        useState(false);

    const [employees, setEmployees] =
        useState<Employee[]>([]);

    const [selectedEmployee, setSelectedEmployee] =
        useState<Employee | null>(null);

    const [employeeSearch, setEmployeeSearch] =
        useState("");

    const [employeeLoading, setEmployeeLoading] =
        useState(false);

    const [employeeMeta, setEmployeeMeta] =
        useState<EmployeeMeta>({
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1,
        });

    const [employeePage, setEmployeePage] =
        useState(1);


    // ====================================================
    // DESIGNATION
    // ====================================================

    const [designations, setDesignations] =
        useState<Designation[]>([]);

    const [selectedDesignation, setSelectedDesignation] =
        useState<number | null>(null);

    const [designationOpen, setDesignationOpen] =
        useState(false);


    // ====================================================
    // SECTION
    // ====================================================

    const [sections, setSections] =
        useState<Section[]>([]);

    const [selectedSection, setSelectedSection] =
        useState<number | null>(null);

    const [sectionOpen, setSectionOpen] =
        useState(false);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [selectedDepartment, setSelectedDepartment] =
        useState<number | null>(null);

    const [departmentOpen, setDepartmentOpen] =
        useState(false);


    // ====================================================
    // LEAVE TYPES
    // ====================================================

    const [leaveTypes, setLeaveTypes] =
        useState<LeaveType[]>([]);

    const [selectedLeaveType, setSelectedLeaveType] =
        useState("");


    // ====================================================
    // LEAVE FORM
    // ====================================================

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [notificationFile, setNotificationFile] =
        useState<File | null>(null);


    // ====================================================
    // PAGE STATES
    // ====================================================

    const [pageLoading, setPageLoading] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // ====================================================
    // LOAD INITIAL DATA
    // ====================================================

    useEffect(() => {

        loadInitialData();

    }, []);


    // ====================================================
    // LOAD DEPARTMENTS DESIGNATIONS, SECTIONS, LEAVE TYPES
    // ====================================================

    const loadInitialData = async () => {

        try {

            setPageLoading(true);

            setErrorMessage("");


            const [
                departmentResponse,
                designationResponse,
                sectionResponse,
                leaveTypeResponse,
            ] = await Promise.all([

                fetch(
                    `${API_URL}/department`
                ),

                fetch(
                    `${API_URL}/designations?page=1&limit=1000`
                ),

                fetch(
                    `${API_URL}/sections`
                ),

                fetch(
                    `${API_URL}/leave/types`
                ),

            ]);

            const departmentResult =
                await departmentResponse.json();

            const designationResult =
                await designationResponse.json();

            const sectionResult =
                await sectionResponse.json();

            const leaveTypeResult =
                await leaveTypeResponse.json();


            if (!departmentResponse.ok) {

                throw new Error(
                    departmentResult.message ||
                    "Failed to load departments."
                );

            }

            if (!designationResponse.ok) {

                throw new Error(
                    designationResult.message ||
                    "Failed to load designations."
                );

            }


            if (!sectionResponse.ok) {

                throw new Error(
                    sectionResult.message ||
                    "Failed to load sections."
                );

            }


            if (!leaveTypeResponse.ok) {

                throw new Error(
                    leaveTypeResult.message ||
                    "Failed to load leave types."
                );

            }

            setDepartments(
                departmentResult.result.data || []
            );

            setDesignations(
                designationResult.result.data || []
            );

            setSections(
                sectionResult.result.data || []
            );

            setLeaveTypes(
                leaveTypeResult.data || []
            );

        } catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to load page data."
            );

        } finally {

            setPageLoading(false);

        }

    };


    // ====================================================
    // FETCH EMPLOYEES
    // ====================================================

    const fetchEmployees = async (
        search = employeeSearch,
        currentPage = employeePage
    ) => {

        try {

            setEmployeeLoading(true);

            const params =
                new URLSearchParams();


            params.set(
                "page",
                String(currentPage)
            );


            params.set(
                "limit",
                "20"
            );


            if (search.trim()) {

                params.set(
                    "search",
                    search.trim()
                );

            }


            if (selectedDesignation) {

                params.set(
                    "designationId",
                    String(selectedDesignation)
                );

            }


            if (selectedSection) {

                params.set(
                    "sectionId",
                    String(selectedSection)
                );

            }

            if (selectedDepartment) {

                params.set(
                    "departmentId",
                    String(selectedDepartment)
                );

            }


            const response =
                await fetch(
                    `${API_URL}/staff?${params.toString()}`
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to load employees."
                );

            }


            setEmployees(
                result.data || []
            );


            if (result.meta) {

                setEmployeeMeta(
                    result.meta
                );

            }

        } catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to load employees."
            );

        } finally {

            setEmployeeLoading(false);

        }

    };

    // ====================================================
    // FETCH SECTIONS
    // ====================================================

    const fetchSections = async (
        departmentId: string
    ) => {

        try {

            if (departmentId === "all") {

                const response =
                    await fetch(
                        `${API_URL}/sections`
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to load sections."
                    );

                }

                setSections(
                    result.result.data || []
                );

            } else {

                const response =
                    await fetch(
                        `${API_URL}/sections/department/${departmentId}`
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to load sections."
                    );

                }

                setSections(
                    result.data || []
                );

            }

        } catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to load sections."
            );

        }

    };


    // ====================================================
    // OPEN EMPLOYEE DROPDOWN
    // ====================================================

    const handleEmployeeDropdown = (
        open: boolean
    ) => {

        setEmployeeOpen(open);


        if (
            open &&
            employees.length === 0
        ) {

            setEmployeePage(1);

            fetchEmployees(
                employeeSearch,
                1
            );

        }

    };


    // ====================================================
    // EMPLOYEE SEARCH
    // ====================================================

    useEffect(() => {

        if (!employeeOpen) {
            return;
        }


        const timer =
            setTimeout(() => {

                setEmployeePage(1);

                fetchEmployees(
                    employeeSearch,
                    1
                );

            }, 400);


        return () => {

            clearTimeout(timer);

        };

    }, [
        employeeSearch,
        selectedDesignation,
        selectedSection,
        selectedDepartment
    ]);


    // ====================================================
    // DESIGNATION FILTER
    // ====================================================

    const handleDesignationChange = (
        value: string
    ) => {

        if (value === "all") {

            setSelectedDesignation(null);

        } else {

            setSelectedDesignation(
                Number(value)
            );

        }


        setEmployeePage(1);

        setEmployees([]);

        if (employeeOpen) {

            setTimeout(() => {

                fetchEmployees(
                    employeeSearch,
                    1
                );

            }, 0);

        }

    };

    // ====================================================
    // DEPARTMENT FILTER
    // ====================================================

    const handleDepartmentChange = (
        value: string
    ) => {

        if (value === "all") {

            setSelectedDepartment(null);

        } else {

            setSelectedDepartment(
                Number(value)
            );

        }


        setEmployeePage(1);

        setEmployees([]);

        setSelectedSection(null);

        setSections([]);

        setTimeout(() => {

            fetchSections(value);

        }, 0);



        if (employeeOpen) {

            setTimeout(() => {

                fetchEmployees(
                    employeeSearch,
                    1
                );

            }, 0);

        }

    };


    // ====================================================
    // SECTION FILTER
    // ====================================================

    const handleSectionChange = (
        value: string
    ) => {

        if (value === "all") {

            setSelectedSection(null);

        } else {

            setSelectedSection(
                Number(value)
            );

        }


        setEmployeePage(1);

        setEmployees([]);

        if (employeeOpen) {

            setTimeout(() => {

                fetchEmployees(
                    employeeSearch,
                    1
                );

            }, 0);

        }

    };


    // ====================================================
    // EMPLOYEE SELECT
    // ====================================================

    const handleEmployeeSelect = (
        employee: Employee
    ) => {

        setSelectedEmployee(
            employee
        );

        setEmployeeOpen(false);

        setErrorMessage("");

    };


    // ====================================================
    // LEAVE TYPE
    // ====================================================

    const selectedLeaveTypeObject =
        leaveTypes.find(
            (leaveType) =>
                String(leaveType.id) ===
                selectedLeaveType
        );


    const isCasualLeave =
        selectedLeaveTypeObject?.name
            ?.trim()
            .toLowerCase() ===
        "casual leave";


    // ====================================================
    // CASUAL LEAVE
    // ====================================================

    useEffect(() => {

        if (
            isCasualLeave &&
            fromDate
        ) {

            setToDate(
                fromDate
            );

        }

    }, [
        isCasualLeave,
        fromDate,
    ]);


    // ====================================================
    // FILE CHANGE
    // ====================================================

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            setNotificationFile(null);

            return;

        }


        if (
            file.type !==
            "application/pdf" &&
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            setErrorMessage(
                "Only PDF files are allowed."
            );

            event.target.value = "";

            return;

        }


        // Optional size restriction
        // Change/remove if your backend
        // allows larger files.

        const maxSize =
            10 * 1024 * 1024;


        if (file.size > maxSize) {

            setErrorMessage(
                "PDF file size cannot exceed 10 MB."
            );

            event.target.value = "";

            return;

        }


        setErrorMessage("");

        setNotificationFile(
            file
        );

    };


    // ====================================================
    // REMOVE PDF
    // ====================================================

    const removeNotificationFile = () => {

        setNotificationFile(
            null
        );

    };


    // ====================================================
    // SUBMIT LEAVE
    // ====================================================

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();


        setErrorMessage("");

        setSuccessMessage("");


        // --------------------------------------------
        // VALIDATION
        // --------------------------------------------

        if (!selectedEmployee) {

            setErrorMessage(
                "Please select an employee."
            );

            return;

        }


        if (!selectedLeaveType) {

            setErrorMessage(
                "Please select a leave type."
            );

            return;

        }


        if (!fromDate) {

            setErrorMessage(
                "Please select the leave start date."
            );

            return;

        }


        if (!toDate) {

            setErrorMessage(
                "Please select the leave end date."
            );

            return;

        }


        if (
            !isCasualLeave &&
            new Date(toDate) <
            new Date(fromDate)
        ) {

            setErrorMessage(
                "To date cannot be earlier than from date."
            );

            return;

        }


        try {

            setSubmitting(true);


            const formData =
                new FormData();


            formData.append(
                "staffId",
                selectedEmployee.id
            );


            formData.append(
                "leaveTypeId",
                selectedLeaveType
            );


            formData.append(
                "fromDate",
                fromDate
            );


            formData.append(
                "toDate",
                isCasualLeave
                    ? fromDate
                    : toDate
            );


            if (reason.trim()) {

                formData.append(
                    "reason",
                    reason.trim()
                );

            }


            // Optional PDF

            if (notificationFile) {

                formData.append(
                    "notification",
                    notificationFile
                );

            }


            const response =
                await fetch(
                    `${API_URL}/leaves`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to mark leave."
                );

            }


            setSuccessMessage(
                result.message ||
                "Leave marked successfully."
            );


            resetForm();


        } catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to mark leave."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ====================================================
    // RESET FORM
    // ====================================================

    const resetForm = () => {

        setSelectedEmployee(
            null
        );

        setSelectedLeaveType("");

        setFromDate("");

        setToDate("");

        setReason("");

        setNotificationFile(
            null
        );

    };


    // ====================================================
    // CLEAR FILTERS
    // ====================================================

    const clearFilters = () => {

        setSelectedDesignation(
            null
        );

        setSelectedSection(
            null
        );

        setSelectedDepartment(
            null
        );

        setEmployeeSearch("");

        setEmployeePage(1);

        setEmployees([]);

        if (employeeOpen) {

            setTimeout(() => {

                fetchEmployees(
                    "",
                    1
                );

            }, 0);

        }

    };


    // ====================================================
    // EMPLOYEE NEXT PAGE
    // ====================================================

    const handleEmployeeNext = () => {

        if (
            employeePage >=
            employeeMeta.totalPages
        ) {

            return;

        }


        const nextPage =
            employeePage + 1;


        setEmployeePage(
            nextPage
        );


        fetchEmployees(
            employeeSearch,
            nextPage
        );

    };


    // ====================================================
    // EMPLOYEE PREVIOUS PAGE
    // ====================================================

    const handleEmployeePrevious = () => {

        if (
            employeePage <= 1
        ) {

            return;

        }


        const previousPage =
            employeePage - 1;


        setEmployeePage(
            previousPage
        );


        fetchEmployees(
            employeeSearch,
            previousPage
        );

    };


    // ====================================================
    // RENDER
    // ====================================================

    return (

        <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

            <div className="mx-auto max-w-5xl">


                {/* ==================================================
            HEADER
        ================================================== */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Mark Leave
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Select an employee and enter
                        the leave details.
                    </p>

                </div>


                {/* ==================================================
            SUCCESS
        ================================================== */}

                {successMessage && (

                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />

                        <div className="flex-1">

                            <p className="font-semibold text-green-800">
                                Success
                            </p>

                            <p className="mt-1 text-sm text-green-700">
                                {successMessage}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage("")
                            }
                            className="text-green-600"
                        >

                            <X className="size-4" />

                        </button>

                    </div>

                )}


                {/* ==================================================
            ERROR
        ================================================== */}

                {errorMessage && (

                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                        <div className="flex-1">

                            <p className="font-semibold text-red-800">
                                Error
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {errorMessage}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setErrorMessage("")
                            }
                            className="text-red-600"
                        >

                            <X className="size-4" />

                        </button>

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >


                    {/* ==================================================
              EMPLOYEE
          ================================================== */}

                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Employee Information
                            </CardTitle>

                            <CardDescription>
                                Filter employees and select the
                                employee for this leave.
                            </CardDescription>

                        </CardHeader>


                        <CardContent className="space-y-5">


                            {/* ============================================
                 DEPARTMENT + SECTION + DESIGNATION
              ============================================ */}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* DEPARTMENT */}

                                <div>

                                    <Label className="mb-2 block">
                                        Department
                                    </Label>

                                    <Popover
                                        open={departmentOpen}
                                        onOpenChange={
                                            setDepartmentOpen
                                        }
                                    >

                                        <PopoverTrigger asChild>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 w-full justify-between font-normal"
                                            >

                                                {selectedDepartment
                                                    ? departments.find(
                                                        (item) =>
                                                            item.id ===
                                                            selectedDepartment
                                                    )?.department
                                                    : (
                                                        <span className="text-slate-400">
                                                            All Departments
                                                        </span>
                                                    )}

                                                <ChevronsUpDown className="size-4 opacity-50" />

                                            </Button>

                                        </PopoverTrigger>


                                        <PopoverContent
                                            align="start"
                                            className="w-[--radix-popover-trigger-width] p-0"
                                        >

                                            <Command>

                                                <CommandInput
                                                    placeholder="Search department..."
                                                />

                                                <CommandList>

                                                    <CommandEmpty>
                                                        No department found.
                                                    </CommandEmpty>

                                                    <CommandGroup>

                                                        <CommandItem
                                                            value="all departements"
                                                            onSelect={() => {

                                                                handleDepartmentChange(
                                                                    "all"
                                                                );

                                                                setDepartmentOpen(
                                                                    false
                                                                );

                                                            }}
                                                        >

                                                            <Check
                                                                className={`mr-2 size-4 ${selectedDepartment ===
                                                                    null
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />

                                                            All Departments

                                                        </CommandItem>


                                                        {departments.map(
                                                            (department) => (

                                                                <CommandItem
                                                                    key={
                                                                        department.id
                                                                    }
                                                                    value={
                                                                        department.department
                                                                    }
                                                                    onSelect={() => {

                                                                        handleDepartmentChange(
                                                                            String(
                                                                                department.id
                                                                            )
                                                                        );

                                                                        setDepartmentOpen(
                                                                            false
                                                                        );

                                                                    }}
                                                                >

                                                                    <Check
                                                                        className={`mr-2 size-4 ${selectedDepartment ===
                                                                            department.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                            }`}
                                                                    />

                                                                    {
                                                                        department.department
                                                                    }

                                                                </CommandItem>

                                                            )
                                                        )}

                                                    </CommandGroup>

                                                </CommandList>

                                            </Command>

                                        </PopoverContent>

                                    </Popover>

                                </div>

                                {/* SECTION */}

                                <div>

                                    <Label className="mb-2 block">
                                        Section
                                    </Label>

                                    <Popover
                                        open={sectionOpen}
                                        onOpenChange={
                                            setSectionOpen
                                        }
                                    >

                                        <PopoverTrigger asChild>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 w-full justify-between font-normal"
                                            >

                                                {selectedSection
                                                    ? sections.find(
                                                        (item) =>
                                                            item.id ===
                                                            selectedSection
                                                    )?.section
                                                    : (
                                                        <span className="text-slate-400">
                                                            All Sections
                                                        </span>
                                                    )}

                                                <ChevronsUpDown className="size-4 opacity-50" />

                                            </Button>

                                        </PopoverTrigger>


                                        <PopoverContent
                                            align="start"
                                            className="w-[--radix-popover-trigger-width] p-0"
                                        >

                                            <Command>

                                                <CommandInput
                                                    placeholder="Search section..."
                                                />

                                                <CommandList>

                                                    <CommandEmpty>
                                                        No section found.
                                                    </CommandEmpty>

                                                    <CommandGroup>

                                                        <CommandItem
                                                            value="all sections"
                                                            onSelect={() => {

                                                                handleSectionChange(
                                                                    "all"
                                                                );

                                                                setSectionOpen(
                                                                    false
                                                                );

                                                            }}
                                                        >

                                                            <Check
                                                                className={`mr-2 size-4 ${selectedSection ===
                                                                    null
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />

                                                            All Sections

                                                        </CommandItem>


                                                        {sections.map(
                                                            (section) => (

                                                                <CommandItem
                                                                    key={
                                                                        section.id
                                                                    }
                                                                    value={
                                                                        section.section
                                                                    }
                                                                    onSelect={() => {

                                                                        handleSectionChange(
                                                                            String(
                                                                                section.id
                                                                            )
                                                                        );

                                                                        setSectionOpen(
                                                                            false
                                                                        );

                                                                    }}
                                                                >

                                                                    <Check
                                                                        className={`mr-2 size-4 ${selectedSection ===
                                                                            section.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                            }`}
                                                                    />

                                                                    {
                                                                        section.section
                                                                    }

                                                                </CommandItem>

                                                            )
                                                        )}

                                                    </CommandGroup>

                                                </CommandList>

                                            </Command>

                                        </PopoverContent>

                                    </Popover>

                                </div>


                                {/* DESIGNATION */}

                                <div>

                                    <Label className="mb-2 block">
                                        Designation
                                    </Label>

                                    <Popover
                                        open={designationOpen}
                                        onOpenChange={
                                            setDesignationOpen
                                        }
                                    >

                                        <PopoverTrigger asChild>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 w-full justify-between font-normal"
                                            >

                                                {selectedDesignation
                                                    ? designations.find(
                                                        (item) =>
                                                            item.id ===
                                                            selectedDesignation
                                                    )?.designation
                                                    : (
                                                        <span className="text-slate-400">
                                                            All Designations
                                                        </span>
                                                    )}

                                                <ChevronsUpDown className="size-4 opacity-50" />

                                            </Button>

                                        </PopoverTrigger>


                                        <PopoverContent
                                            align="start"
                                            className="w-[--radix-popover-trigger-width] p-0"
                                        >

                                            <Command>

                                                <CommandInput
                                                    placeholder="Search designation..."
                                                />

                                                <CommandList>

                                                    <CommandEmpty>
                                                        No designation found.
                                                    </CommandEmpty>

                                                    <CommandGroup>

                                                        <CommandItem
                                                            value="all designations"
                                                            onSelect={() => {

                                                                handleDesignationChange(
                                                                    "all"
                                                                );

                                                                setDesignationOpen(
                                                                    false
                                                                );

                                                            }}
                                                        >

                                                            <Check
                                                                className={`mr-2 size-4 ${selectedDesignation ===
                                                                    null
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />

                                                            All Designations

                                                        </CommandItem>


                                                        {designations.map(
                                                            (designation) => (

                                                                <CommandItem
                                                                    key={
                                                                        designation.id
                                                                    }
                                                                    value={
                                                                        designation.designation + " " + designation.scale.scale
                                                                    }
                                                                    onSelect={() => {

                                                                        handleDesignationChange(
                                                                            String(
                                                                                designation.id
                                                                            )
                                                                        );

                                                                        setDesignationOpen(
                                                                            false
                                                                        );

                                                                    }}
                                                                >

                                                                    <Check
                                                                        className={`mr-2 size-4 ${selectedDesignation ===
                                                                            designation.id
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                            }`}
                                                                    />

                                                                    {
                                                                        designation.designation + " " + designation.scale.scale
                                                                    }

                                                                </CommandItem>

                                                            )
                                                        )}

                                                    </CommandGroup>

                                                </CommandList>

                                            </Command>

                                        </PopoverContent>

                                    </Popover>

                                </div>

                            </div>


                            {/* ============================================
                  EMPLOYEE DROPDOWN
              ============================================ */}

                            <div>

                                <Label className="mb-2 block">

                                    Employee

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>

                                </Label>


                                <Popover
                                    open={employeeOpen}
                                    onOpenChange={
                                        handleEmployeeDropdown
                                    }
                                >

                                    <PopoverTrigger asChild>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={
                                                employeeOpen
                                            }
                                            className="h-12 w-full justify-between font-normal"
                                        >

                                            {selectedEmployee ? (

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                                                        <User className="size-4" />

                                                    </div>

                                                    <div className="min-w-0 text-left">

                                                        <p className="truncate font-medium text-slate-800">

                                                            {
                                                                selectedEmployee.employeeName
                                                            }

                                                        </p>

                                                        <p className="truncate text-xs text-slate-500">

                                                            {
                                                                selectedEmployee.empNo
                                                            }

                                                            {selectedEmployee.designation &&
                                                                ` • ${selectedEmployee.designation}`}

                                                        </p>

                                                    </div>

                                                </div>

                                            ) : (

                                                <span className="text-slate-400">
                                                    Select employee...
                                                </span>

                                            )}

                                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />

                                        </Button>

                                    </PopoverTrigger>


                                    <PopoverContent
                                        align="start"
                                        className="w-[--radix-popover-trigger-width] p-0"
                                    >

                                        <Command
                                            shouldFilter={false}
                                        >

                                            {/* SEARCH */}

                                            <CommandInput
                                                placeholder="Search employee by name or employee number..."
                                                value={
                                                    employeeSearch
                                                }
                                                onValueChange={
                                                    setEmployeeSearch
                                                }
                                            />


                                            <CommandList>

                                                {/* LOADING */}

                                                {employeeLoading ? (

                                                    <div className="flex items-center justify-center py-8">

                                                        <Loader2 className="size-5 animate-spin text-slate-400" />

                                                        <span className="ml-2 text-sm text-slate-500">
                                                            Loading employees...
                                                        </span>

                                                    </div>

                                                ) : employees.length ===
                                                    0 ? (

                                                    <CommandEmpty>

                                                        <div className="py-4 text-center">

                                                            <Search className="mx-auto size-6 text-slate-300" />

                                                            <p className="mt-2 text-sm font-medium text-slate-600">
                                                                No employees found
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Try another search or filter.
                                                            </p>

                                                        </div>

                                                    </CommandEmpty>

                                                ) : (

                                                    <CommandGroup
                                                        heading={
                                                            employeeMeta.total >
                                                                0
                                                                ? `${employeeMeta.total.toLocaleString()} Employees`
                                                                : "Employees"
                                                        }
                                                    >

                                                        {employees.map(
                                                            (employee) => {

                                                                const isSelected =
                                                                    selectedEmployee?.id ===
                                                                    employee.id;


                                                                return (

                                                                    <CommandItem
                                                                        key={
                                                                            employee.id
                                                                        }
                                                                        value={`${employee.empNo} ${employee.employeeName}`}
                                                                        onSelect={() =>
                                                                            handleEmployeeSelect(
                                                                                employee
                                                                            )
                                                                        }
                                                                        className="cursor-pointer py-3"
                                                                    >

                                                                        <Check
                                                                            className={`mr-2 size-4 shrink-0 ${isSelected
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                                }`}
                                                                        />


                                                                        <div className="flex min-w-0 flex-1 items-center gap-3">

                                                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">

                                                                                <User className="size-4" />

                                                                            </div>


                                                                            <div className="min-w-0">

                                                                                <p className="truncate font-medium text-slate-800">

                                                                                    {
                                                                                        employee.employeeName
                                                                                    }

                                                                                </p>


                                                                                <p className="truncate text-xs text-slate-500">

                                                                                    {
                                                                                        employee.empNo
                                                                                    }

                                                                                    {employee.designation &&
                                                                                        ` • ${employee.designation}`}

                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </CommandItem>

                                                                );

                                                            }
                                                        )}

                                                    </CommandGroup>

                                                )}

                                            </CommandList>


                                            {/* PAGINATION */}

                                            {!employeeLoading &&
                                                employeeMeta.totalPages >
                                                1 && (

                                                    <div className="flex items-center justify-between border-t bg-slate-50 px-3 py-2">

                                                        <span className="text-xs text-slate-500">

                                                            Page{" "}
                                                            {
                                                                employeePage
                                                            }{" "}
                                                            of{" "}
                                                            {
                                                                employeeMeta.totalPages
                                                            }

                                                        </span>


                                                        <div className="flex gap-1">

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                disabled={
                                                                    employeePage <=
                                                                    1
                                                                }
                                                                onClick={
                                                                    handleEmployeePrevious
                                                                }
                                                            >

                                                                <ChevronLeft className="size-4" />

                                                            </Button>


                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                                disabled={
                                                                    employeePage >=
                                                                    employeeMeta.totalPages
                                                                }
                                                                onClick={
                                                                    handleEmployeeNext
                                                                }
                                                            >

                                                                <ChevronRight className="size-4" />

                                                            </Button>

                                                        </div>

                                                    </div>

                                                )}

                                        </Command>

                                    </PopoverContent>

                                </Popover>


                                {/* SELECTED EMPLOYEE */}

                                {selectedEmployee && (

                                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3">

                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                                            <User className="size-5" />

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-sm font-semibold text-blue-900">

                                                {
                                                    selectedEmployee.employeeName
                                                }

                                            </p>


                                            <p className="truncate text-xs text-blue-700">

                                                {
                                                    selectedEmployee.empNo
                                                }

                                                {selectedEmployee.designation &&
                                                    ` • ${selectedEmployee.designation}`}

                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedEmployee(
                                                    null
                                                )
                                            }
                                            className="rounded-md p-1 text-blue-600 hover:bg-blue-100"
                                        >

                                            <X className="size-4" />

                                        </button>

                                    </div>

                                )}

                            </div>


                            {/* CLEAR FILTERS */}

                            {(selectedDesignation ||
                                selectedSection ||
                                selectedDepartment ||
                                employeeSearch) && (

                                    <div className="flex justify-end">

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={
                                                clearFilters
                                            }
                                        >

                                            Clear Filters

                                        </Button>

                                    </div>

                                )}

                        </CardContent>

                    </Card>


                    {/* ==================================================
              LEAVE DETAILS
          ================================================== */}

                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Leave Details
                            </CardTitle>

                            <CardDescription>
                                Enter the leave information.
                            </CardDescription>

                        </CardHeader>


                        <CardContent className="space-y-5">


                            {/* LEAVE TYPE */}

                            <div>

                                <Label className="mb-2 block">

                                    Leave Type

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>

                                </Label>


                                <Select
                                    value={
                                        selectedLeaveType
                                    }
                                    onValueChange={
                                        setSelectedLeaveType
                                    }
                                >

                                    <SelectTrigger className="h-11">

                                        <SelectValue
                                            placeholder="Select leave type"
                                        />

                                    </SelectTrigger>


                                    <SelectContent>

                                        {leaveTypes.map(
                                            (leaveType) => (

                                                <SelectItem
                                                    key={
                                                        leaveType.id
                                                    }
                                                    value={String(
                                                        leaveType.id
                                                    )}
                                                >

                                                    {
                                                        leaveType.name
                                                    }

                                                </SelectItem>

                                            )
                                        )}

                                    </SelectContent>

                                </Select>

                            </div>


                            {/* DATES */}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                                {/* FROM DATE */}

                                <div>

                                    <Label className="mb-2 block">

                                        From Date

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>

                                    </Label>


                                    <div className="relative">

                                        <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            type="date"
                                            value={
                                                fromDate
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setFromDate(
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 pl-10"
                                        />

                                    </div>

                                </div>


                                {/* TO DATE */}

                                <div>

                                    <Label className="mb-2 block">

                                        To Date

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>

                                    </Label>


                                    <div className="relative">

                                        <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                                        <Input
                                            type="date"
                                            value={
                                                isCasualLeave
                                                    ? fromDate
                                                    : toDate
                                            }
                                            min={
                                                fromDate ||
                                                undefined
                                            }
                                            disabled={
                                                isCasualLeave
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setToDate(
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 pl-10"
                                        />

                                    </div>


                                    {isCasualLeave && (

                                        <p className="mt-2 text-xs text-amber-600">

                                            Casual Leave can only
                                            be marked for one day.

                                        </p>

                                    )}

                                </div>

                            </div>


                            {/* REASON */}

                            <div>

                                <Label className="mb-2 block">
                                    Reason
                                </Label>

                                <Textarea
                                    value={
                                        reason
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setReason(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter leave reason..."
                                    rows={4}
                                />

                            </div>


                            {/* ==================================================
                  PDF NOTIFICATION
              ================================================== */}

                            <div>

                                <Label className="mb-2 block">

                                    Leave Notification

                                    <span className="ml-2 text-xs font-normal text-slate-400">
                                        Optional
                                    </span>

                                </Label>


                                {!notificationFile ? (

                                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-blue-400 hover:bg-blue-50">

                                        <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                                            <FileText className="size-6" />

                                        </div>


                                        <p className="mt-3 font-medium text-slate-700">

                                            Attach notification PDF

                                        </p>


                                        <p className="mt-1 text-xs text-slate-500">

                                            PDF only, maximum 10 MB

                                        </p>


                                        <input
                                            type="file"
                                            accept="application/pdf,.pdf"
                                            className="hidden"
                                            onChange={
                                                handleFileChange
                                            }
                                        />

                                    </label>

                                ) : (

                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">

                                            <FileText className="size-5" />

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-sm font-medium text-slate-800">

                                                {
                                                    notificationFile.name
                                                }

                                            </p>


                                            <p className="mt-1 text-xs text-slate-500">

                                                {(
                                                    notificationFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB

                                            </p>

                                        </div>


                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={
                                                removeNotificationFile
                                            }
                                        >

                                            <X className="size-4" />

                                        </Button>

                                    </div>

                                )}

                            </div>

                        </CardContent>

                    </Card>


                    {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                submitting
                            }
                            onClick={() => {

                                resetForm();

                                setErrorMessage("");

                                setSuccessMessage("");

                            }}
                        >

                            Reset

                        </Button>


                        <Button
                            type="submit"
                            disabled={
                                submitting ||
                                !selectedEmployee
                            }
                            className="min-w-[160px]"
                        >

                            {submitting ? (

                                <>

                                    <Loader2 className="mr-2 size-4 animate-spin" />

                                    Marking Leave...

                                </>

                            ) : (

                                <>

                                    <CalendarDays className="mr-2 size-4" />

                                    Mark Leave

                                </>

                            )}

                        </Button>

                    </div>

                </form>

            </div>

        </div>

    );

}