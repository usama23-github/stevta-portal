"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format } from "date-fns";
import {
    CalendarIcon,
    RotateCcw,
    Search,
    Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useReportFilters } from "@/hooks/useReportFilters";

interface ReportFiltersProps {
    query: any;
    setQuery: Dispatch<SetStateAction<any>>;
    refresh?: () => void;
}

export default function ReportFilters({
    query,
    setQuery,
    refresh,
}: ReportFiltersProps) {
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();

    const {
        postingPlaces,
        sections,
        designations,
    } = useReportFilters();

    useEffect(() => {
        if (query.fromDate) {
            setDateFrom(new Date(query.fromDate));
        } else {
            setDateFrom(undefined);
        }
    }, [query.fromDate]);

    useEffect(() => {
        if (query.toDate) {
            setDateTo(new Date(query.toDate));
        } else {
            setDateTo(undefined);
        }
    }, [query.toDate]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />

                <h2 className="text-lg font-semibold">
                    Report Filters
                </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-12">
                {/* Search */}

                <div className="lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium">
                        Search Staff
                    </label>

                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                        <Input
                            className="h-11 pl-10"
                            placeholder="Employee Name or Employee No"
                            value={query.search}
                            onChange={(e) =>
                                setQuery((prev: any) => ({
                                    ...prev,
                                    page: 1,
                                    search: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                {/* Date From */}

                <div className="lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium">
                        Date From
                    </label>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 w-full justify-start font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />

                                {dateFrom ? format(dateFrom, "PPP") : "Select Date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={dateFrom}
                                onSelect={(selected) => {
                                    setDateFrom(selected);

                                    setQuery((prev: any) => ({
                                        ...prev,
                                        page: 1,
                                        fromDate: selected
                                            ? format(selected, "yyyy-MM-dd")
                                            : undefined,
                                        date: undefined,
                                    }));
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Date To */}

                <div className="lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium">
                        Date To
                    </label>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-11 w-full justify-start font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />

                                {dateTo ? format(dateTo, "PPP") : "Select Date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={dateTo}
                                onSelect={(selected) => {
                                    setDateTo(selected);

                                    setQuery((prev: any) => ({
                                        ...prev,
                                        page: 1,
                                        toDate: selected
                                            ? format(selected, "yyyy-MM-dd")
                                            : undefined,
                                        date: undefined,
                                    }));
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-12 mt-4">

                {/* Posting Place */}

                <div className="lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">
                        Posting Place
                    </label>

                    <Select
                        value={String(query.postingPlaceId ?? "all")}
                        onValueChange={(value) =>
                            setQuery((prev: any) => ({
                                ...prev,
                                page: 1,
                                postingPlaceId:
                                    value === "all"
                                        ? undefined
                                        : Number(value),
                            }))
                        }
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="All Posting Places" />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All Posting Places
                            </SelectItem>

                            {postingPlaces.map((item: any) => (

                                <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.postingPlace}
                                </SelectItem>

                            ))}

                        </SelectContent>
                    </Select>
                </div>

                {/* Section */}

                <div className="lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">
                        Section
                    </label>

                    <Select
                        value={String(query.sectionId ?? "all")}
                        onValueChange={(value) =>
                            setQuery((prev: any) => ({
                                ...prev,
                                page: 1,
                                sectionId:
                                    value === "all"
                                        ? undefined
                                        : Number(value),
                            }))
                        }
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="All Sections" />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All Sections
                            </SelectItem>

                            {sections.map((item: any) => (

                                <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.section}
                                </SelectItem>

                            ))}

                        </SelectContent>
                    </Select>
                </div>

                <div className="lg:col-span-3">

                    <label className="mb-2 block text-sm font-medium">
                        Designation
                    </label>

                    <Select
                        value={String(query.designationId ?? "all")}
                        onValueChange={(value) =>
                            setQuery((prev: any) => ({
                                ...prev,
                                page: 1,
                                designationId:
                                    value === "all"
                                        ? undefined
                                        : Number(value),
                            }))
                        }
                    >
                        <SelectTrigger className="h-11">

                            <SelectValue placeholder="All Designations" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All Designations
                            </SelectItem>

                            {designations.map((item: any) => (

                                <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.designation} ({item.scale.scale})
                                </SelectItem>

                            ))}

                        </SelectContent>

                    </Select>

                </div>

                {/* Attendance Status */}

                <div className="lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">
                        Attendance Status
                    </label>

                    <Select
                        value={String(query.attendanceStatusId ?? "all")}
                        onValueChange={(value) =>
                            setQuery((prev: any) => ({
                                ...prev,
                                page: 1,
                                attendanceStatusId:
                                    value === "all"
                                        ? undefined
                                        : Number(value),
                            }))
                        }
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Status
                            </SelectItem>

                            <SelectItem value="1">
                                Present
                            </SelectItem>

                            <SelectItem value="2">
                                Absent
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <Button
                    variant="outline"
                    className="h-11"
                    onClick={() => {
                        setDateFrom(undefined);
                        setDateTo(undefined);

                        setQuery({
                            page: 1,
                            limit: 1000,
                            date: new Date().toISOString().split("T")[0],
                            fromDate: undefined,
                            toDate: undefined,
                            search: "",
                            postingPlaceId: undefined,
                            sectionId: undefined,
                            designationId: undefined,
                            attendanceStatusId: undefined,
                            checkInStatusId: undefined,
                        });
                    }}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>

                <Button
                    className="h-11 px-8"
                    onClick={() => refresh?.()}
                >
                    Generate Report
                </Button>
            </div>
        </div>
    );
}