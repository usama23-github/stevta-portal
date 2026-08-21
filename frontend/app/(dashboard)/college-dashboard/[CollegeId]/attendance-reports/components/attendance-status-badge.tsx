interface Props {
    status: string;
    leaveType: string;
}

export default function AttendanceStatusBadge({
    status,
    leaveType
}: Props) {
    console.log("STATUS", status);
    switch (status) {
        case "Present":
            return (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Present
                </span>
            );

        case "Absent":
            return (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Absent
                </span>
            );

        case "Leave":
            return (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                    {leaveType}
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