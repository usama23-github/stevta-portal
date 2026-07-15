"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface AttendancePaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export default function AttendancePagination({
    page,
    totalPages,
    total,
    limit,
    onPageChange,
}: AttendancePaginationProps) {
    const start =
        total === 0 ? 0 : (page - 1) * limit + 1;

    const end = Math.min(page * limit, total);

    const getPages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (page >= totalPages - 3) {
                pages.push(
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    page - 1,
                    page,
                    page + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className="mt-6 flex flex-col gap-4 border-t pt-5 md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold">
                    {start}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                    {end}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                    {total}
                </span>{" "}
                records
            </p>

            <div className="flex items-center gap-2">

                <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() =>
                        onPageChange(page - 1)
                    }
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((p, index) => {
                    if (p === "...") {
                        return (
                            <span
                                key={index}
                                className="px-2 text-slate-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={p}
                            variant={
                                p === page
                                    ? "default"
                                    : "outline"
                            }
                            className="w-10"
                            onClick={() =>
                                onPageChange(Number(p))
                            }
                        >
                            {p}
                        </Button>
                    );
                })}

                <Button
                    variant="outline"
                    size="icon"
                    disabled={
                        page === totalPages
                    }
                    onClick={() =>
                        onPageChange(page + 1)
                    }
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

            </div>
        </div>
    );
}