"use client";

import { useState } from "react";
import {
    CalendarDays,
    CalendarRange,
    CalendarClock,
    Calendar,
    Building2,
} from "lucide-react";
import clsx from "clsx";

const tabs = [
    {
        id: "daily",
        label: "Daily",
        icon: CalendarDays,
    },
    {
        id: "weekly",
        label: "Weekly",
        icon: CalendarRange,
    },
    {
        id: "monthly",
        label: "Monthly",
        icon: CalendarClock,
    },
    {
        id: "range",
        label: "Date Range",
        icon: Calendar,
    },
    {
        id: "section",
        label: "Section Wise",
        icon: Building2,
    },
];

export default function ReportTabs() {
    const [activeTab, setActiveTab] = useState("daily");

    return (
        <div className="border-b bg-slate-50 px-6">
            {/* <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "relative flex min-w-max items-center gap-2 px-6 py-5 text-sm font-medium transition-all duration-200",

                                activeTab === tab.id
                                    ? "text-blue-700"
                                    : "text-slate-500 hover:text-blue-600"
                            )}
                        >
                            <Icon className="h-5 w-5" />

                            {tab.label}

                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-blue-600" />
                            )}
                        </button>
                    );
                })}
            </div> */}
        </div>
    );
}