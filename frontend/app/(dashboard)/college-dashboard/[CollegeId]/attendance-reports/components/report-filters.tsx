"use client";

import { useState } from "react";
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

export default function ReportFilters() {
    const [date, setDate] = useState<Date>();

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
                            placeholder="Employee name or employee no"
                        />

                    </div>

                </div>

                {/* Date */}

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Date
                    </label>

                    <Popover>

                        <PopoverTrigger asChild>

                            <Button
                                variant="outline"
                                className="h-11 w-full justify-start font-normal"
                            >

                                <CalendarIcon className="mr-2 h-4 w-4" />

                                {date
                                    ? format(date, "PPP")
                                    : "Select Date"}

                            </Button>

                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                            />
                        </PopoverContent>

                    </Popover>

                </div>

                {/* Posting Place */}

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Posting Place
                    </label>

                    <Select>

                        <SelectTrigger className="h-11">

                            <SelectValue placeholder="All" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All Posting Places
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </div>

                {/* Section */}

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Section
                    </label>

                    <Select>

                        <SelectTrigger className="h-11">

                            <SelectValue placeholder="All" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All Sections
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </div>

                {/* Attendance */}

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                        Attendance Status
                    </label>

                    <Select>

                        <SelectTrigger className="h-11">

                            <SelectValue placeholder="All" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="all">
                                All
                            </SelectItem>

                            <SelectItem value="1">
                                Present
                            </SelectItem>

                            <SelectItem value="2">
                                Absent
                            </SelectItem>

                            <SelectItem value="3">
                                Late
                            </SelectItem>

                        </SelectContent>

                    </Select>

                </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">

                <Button
                    variant="outline"
                    className="h-11"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />

                    Reset

                </Button>

                <Button className="h-11 px-8">

                    Generate Report

                </Button>

            </div>

        </div>
    );
}