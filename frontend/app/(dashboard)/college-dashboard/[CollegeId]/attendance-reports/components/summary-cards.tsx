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

interface Summary {
    totalStaff: number;
    present: number;
    absent: number;
    late: number;
    earlyCheckout: number;
    attendancePercentage?: number;
}

interface SummaryCardsProps {
    summary?: Summary;
    loading?: boolean;
}

export default function SummaryCards({
    summary,
    loading,
}: SummaryCardsProps) {
    const cards = [
        {
            title: "Total Staff",
            value: summary?.totalStaff ?? 0,
            icon: Users,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Present",
            value: summary?.present ?? 0,
            icon: UserCheck,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Absent",
            value: summary?.absent ?? 0,
            icon: UserX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Late",
            value: summary?.late ?? 0,
            icon: Clock3,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            title: "Early Out",
            value: summary?.earlyCheckout ?? 0,
            icon: LogOut,
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
        },
        {
            title: "Attendance %",
            value: `${summary?.attendancePercentage ?? 0}%`,
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