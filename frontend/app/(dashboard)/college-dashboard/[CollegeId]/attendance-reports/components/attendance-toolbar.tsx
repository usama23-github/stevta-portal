"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {

    Select,

    SelectContent,

    SelectItem,

    SelectTrigger,

    SelectValue,

} from "@/components/ui/select";

export default function AttendanceToolbar({

    pageSize,

    setPageSize,

    search,

    setSearch,

}: any) {

    return (

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

                <Select

                    value={String(pageSize)}

                    onValueChange={(v) => setPageSize(Number(v))}

                >

                    <SelectTrigger className="w-28">

                        <SelectValue />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="10">10</SelectItem>

                        <SelectItem value="25">25</SelectItem>

                        <SelectItem value="50">50</SelectItem>

                        <SelectItem value="100">100</SelectItem>

                    </SelectContent>

                </Select>

            </div>

            <div className="relative w-full md:w-96">

                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />

                <Input

                    className="pl-9"

                    placeholder="Search employee..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

            </div>

        </div>

    );

}