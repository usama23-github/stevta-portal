import AttendanceTrendChart from "./attendance-trend-chart";
import SectionAttendanceChart from "./section-attendance-chart";

export default function ReportCharts() {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <AttendanceTrendChart />

            <SectionAttendanceChart />
        </div>
    );
}