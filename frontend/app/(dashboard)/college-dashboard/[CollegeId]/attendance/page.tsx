"use client";

import { parseAttendanceText } from "@/lib/attendance-parser";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";

type AttendanceRecord = {
  id: string;
  employeeNo: string;
  name: string;
  date: string;
  status: "Present" | "Absent";
  checkIn: string;
  checkInStatus: "On Time" | "Late";
  checkOut: string;
  checkOutStatus: "On Time" | "Early" | "-";
  workingHours: string;
};

const ITEMS_PER_PAGE = 10;

export default function AttendanceTable() {
  const today = new Date().toISOString().split("T")[0];

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedDate, setSelectedDate] = useState(today);

  const [page, setPage] = useState(1);

  // ===============================
  // FETCH DATA FROM TEXT FILE
  // ===============================
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("/attendance-data.txt");

        const text = await response.text();

        const parsedData = parseAttendanceText(text);

        setAttendanceData(parsedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  console.log("attendanceData length:", attendanceData.length);
  console.log("sample item:", attendanceData[0]);

  // ===============================
  // FILTERS
  // ===============================
  const filteredData = useMemo(() => {
    const searchText = (search ?? "").trim().toLowerCase();
    const statusValue = (statusFilter ?? "").trim().toLowerCase();

    const selected = selectedDate
      ? new Date(selectedDate).toISOString().split("T")[0]
      : "";

    return attendanceData.filter((item) => {
      const name = (item.name ?? "").toLowerCase();
      const status = (item.status ?? "").toLowerCase();
      const date = (item.date ?? "").split("T")[0];

      const matchesSearch = searchText === "" || name.includes(searchText);

      const matchesStatus = statusValue === "all" || status === statusValue;

      const matchesDate = !selectedDate || date === selected;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendanceData, search, statusFilter, selectedDate]);

  console.log("filteredData", filteredData);

  // ===============================
  // PAGINATION
  // ===============================
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-[#64748b]">Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-[#e2e8f0] p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Staff Attendance Record
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Daily attendance monitoring and workforce tracking
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* DATE FILTER */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-[#f8fafc]">
            <tr>
              {[
                "Staff Name",
                "Date",
                "Attendance",
                "Check In",
                "Check In Status",
                "Check Out",
                "Check Out Status",
                "Working Hours",
              ].map((heading) => (
                <th
                  key={heading}
                  className="border-b border-[#e2e8f0] px-6 py-4 text-left text-sm font-semibold text-[#334155]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((record) => (
              <tr key={record.id} className="transition hover:bg-[#f8fafc]">
                {/* NAME */}
                <td className="border-b border-[#f1f5f9] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] font-semibold text-[#2563eb]">
                      {record.name.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-[#0f172a]">
                        {record.name}
                      </p>

                      <p className="text-xs text-[#64748b]">
                        Staff ID #{record.employeeNo}
                      </p>
                    </div>
                  </div>
                </td>

                {/* DATE */}
                <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">
                  {record.date}
                </td>

                {/* ATTENDANCE */}
                <td className="border-b border-[#f1f5f9] px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {record.status === "Present" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}

                    {record.status}
                  </div>
                </td>

                {/* CHECK IN */}
                <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">
                  {record.checkIn}
                </td>

                {/* CHECK IN STATUS */}
                <td className="border-b border-[#f1f5f9] px-6 py-4">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      record.checkInStatus === "On Time"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {record.checkInStatus}
                  </div>
                </td>

                {/* CHECK OUT */}
                <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">
                  {record.checkOut}
                </td>

                {/* CHECK OUT STATUS */}
                <td className="border-b border-[#f1f5f9] px-6 py-4">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      record.checkOutStatus === "On Time"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.checkOutStatus}
                  </div>
                </td>

                {/* WORKING HOURS */}
                <td className="border-b border-[#f1f5f9] px-6 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-1 text-sm font-semibold text-[#1d4ed8]">
                    <Clock3 className="h-4 w-4" />

                    {record.workingHours}
                  </div>
                </td>
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center text-[#64748b]"
                >
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-4 border-t border-[#e2e8f0] p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#64748b]">
          Showing{" "}
          <span className="font-semibold text-[#0f172a]">
            {paginatedData.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#0f172a]">
            {filteredData.length}
          </span>{" "}
          records
        </p>

        {/* PAGINATION */}
        <div className="flex items-center gap-2 overflow-x-scroll">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
                page === index + 1
                  ? "bg-[#2563eb] text-white"
                  : "border border-[#dbe4f0] bg-white text-[#334155] hover:bg-[#f8fafc]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe4f0] bg-white text-[#334155] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
