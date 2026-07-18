"use client";

import {
    Users,
    UserCheck,
    UserX,
    Clock3,
    LogOut,
    TrendingUp,
} from "lucide-react";

import SummaryCard from "./summary-card";
import { AttendanceSummary } from "@/types/attendance";

interface SummaryCardsProps {
    summary?: AttendanceSummary[];
    loading?: boolean;
}

export default function SummaryCards({
    summary = [],
    loading,
}: SummaryCardsProps) {

    const totals = summary.reduce(
        (acc, item) => {
            acc.totalStaff = Math.max(acc.totalStaff, item.totalStaff);
            acc.present += item.present;
            acc.absent += item.absent;
            acc.late += item.late;
            acc.earlyCheckout += item.earlyCheckout;
            acc.notMarked += item.notMarked;

            return acc;
        },
        {
            totalStaff: 0,
            present: 0,
            absent: 0,
            late: 0,
            earlyCheckout: 0,
            notMarked: 0,
        }
    );

    const attendancePercentage =
        totals.totalStaff > 0 && summary.length > 0
            ? Number(
                (
                    (totals.present /
                        (totals.totalStaff * summary.length)) *
                    100
                ).toFixed(2)
            )
            : 0;

    const cards = [
        {
            title: "Total Staff",
            value: totals.totalStaff,
            icon: Users,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Present",
            value: totals.present,
            icon: UserCheck,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Absent",
            value: totals.absent,
            icon: UserX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Late",
            value: totals.late,
            icon: Clock3,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            title: "Early Out",
            value: totals.earlyCheckout,
            icon: LogOut,
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
        },
        {
            title: "Attendance %",
            value: `${attendancePercentage}%`,
            icon: TrendingUp,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {cards.map((card) => (
                <SummaryCard
                    key={card.title}
                    title={card.title}
                    value={loading ? "..." : card.value}
                    icon={card.icon}
                    iconBg={card.iconBg}
                    iconColor={card.iconColor}
                />
            ))}
        </div>
    );
}