import * as XLSX from "xlsx";

interface ExportAttendanceExcelParams {
    summary: any[];
    summarySection: any[];
    rows: any[];
    fromDate: string;
    toDate: string;
}

export function exportAttendanceExcel({
    summary,
    summarySection,
    rows,
    fromDate,
    toDate,
}: ExportAttendanceExcelParams) {
    const workbook = XLSX.utils.book_new();

    // -----------------------------
    // Attendance Summary
    // -----------------------------
    if (summary?.length) {
        const summarySheet = XLSX.utils.json_to_sheet(summary);

        XLSX.utils.book_append_sheet(
            workbook,
            summarySheet,
            "Attendance Summary"
        );
    }

    // -----------------------------
    // Section Wise Summary
    // -----------------------------
    if (summarySection?.length) {
        const sectionSheet = XLSX.utils.json_to_sheet(summarySection);

        XLSX.utils.book_append_sheet(
            workbook,
            sectionSheet,
            "Section Summary"
        );
    }

    // -----------------------------
    // Attendance Details
    // -----------------------------
    if (rows?.length) {
        const detailsSheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(
            workbook,
            detailsSheet,
            "Attendance Details"
        );
    }

    // -----------------------------
    // File name
    // -----------------------------
    const fileName = `Attendance_Report_${fromDate}_to_${toDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
}