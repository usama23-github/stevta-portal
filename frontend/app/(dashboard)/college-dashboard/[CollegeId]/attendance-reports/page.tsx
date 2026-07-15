import ReportHeader from "./components/report-header";
import ReportTabs from "./components/report-tabs";
import ReportFilters from "./components/report-filters";
import SummaryCards from "./components/summary-cards";
import ReportCharts from "./components/report-charts";
import AttendanceTable from "./components/attendance-table";

export default function AttendanceReportsPage() {
    return (
        <div className="space-y-6 p-6">
            <ReportHeader />

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <ReportTabs />

                <div className="border-t p-6 space-y-6">
                    <ReportFilters />

                    <SummaryCards />

                    <ReportCharts />

                    <AttendanceTable />
                </div>
            </div>
        </div>
    );
}