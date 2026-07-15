import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}: SummaryCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
                >
                    <Icon
                        className={`h-7 w-7 ${iconColor}`}
                    />
                </div>
            </div>
        </div>
    );
}