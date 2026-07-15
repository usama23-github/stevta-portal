interface Props {
    status: number;
}

export default function AttendanceStatusBadge({
    status,
}: Props) {
    switch (status) {
        case 1:
            return (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Present
                </span>
            );

        case 2:
            return (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Absent
                </span>
            );

        default:
            return (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                    Unknown
                </span>
            );
    }
}