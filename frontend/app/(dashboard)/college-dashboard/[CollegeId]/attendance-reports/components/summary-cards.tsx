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

export default function SummaryCards() {
    const cards = [
        {
            title: "Total Staff",
            value: 1258,
            icon: Users,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Present",
            value: 1201,
            icon: UserCheck,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Absent",
            value: 41,
            icon: UserX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Late",
            value: 11,
            icon: Clock3,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            title: "Early Out",
            value: 8,
            icon: LogOut,
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
        },
        {
            title: "Attendance %",
            value: "95.5%",
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
                    {...card}
                />
            ))}
        </div>
    );
}