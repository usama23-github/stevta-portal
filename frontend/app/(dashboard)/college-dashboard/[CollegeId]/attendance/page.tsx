"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";

import { getStaffAttendance, StaffAttendance } from "@/lib/api/attendance";

export default function AttendanceTable() {

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Karachi",
  });

  const [loading, setLoading] = useState(true);

  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [checkInStatusFilter, setCheckInStatusFilterFilter] = useState("");

  const [selectedDate, setSelectedDate] = useState(today);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showRecords, setShowRecords] = useState(0);

  const loadData = async (
    pageNumber = page,
    searchValue = search,
    attendanceStatusId = statusFilter,
    date = selectedDate,
    checkInStatusId = checkInStatusFilter
  ) => {
    try {
      setLoading(true);

      const result = await getStaffAttendance(
        pageNumber,
        10,
        searchValue,
        attendanceStatusId,
        date,
        checkInStatusId
      );

      setStaffAttendance(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalStaff(result.meta.total);
      setLimit(result.meta.limit);
      setShowRecords(result.data.length);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);


  const handleSearch = async (searchValue: any) => {
    setPage(1);
    loadData(1, searchValue, statusFilter, selectedDate, checkInStatusFilter);
  };

  const handleChangeDate = async (date: any) => {
    setPage(1);
    loadData(1, search, statusFilter, date, checkInStatusFilter);
  };

  const handleChangeAttendanceStatus = async (attendanceStatusId: any) => {
    setPage(1);
    loadData(1, search, attendanceStatusId, selectedDate, checkInStatusFilter);
  };

  const handleChangeCheckInStatus = async (checkInStatusId: any) => {
    setPage(1);
    loadData(1, search, statusFilter, selectedDate, checkInStatusId);
  };

  return (
    <>
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
          <div className="">
            <div className="mb-4">
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
                    if (e.target.value === "") {
                      handleSearch(e.target.value);
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                />
                <Button className="absolute right-0 h-11" onClick={() => handleSearch(search)}>
                  Search
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* DATE FILTER */}
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setPage(1);
                    handleChangeDate(e.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* ATTENDANCE STATUS FILTER */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                    handleChangeAttendanceStatus(e.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Attendance Status</option>
                  <option value="1">Present</option>
                  <option value="2">Absent</option>
                </select>
              </div>

              {/* CHECK IN STATUS FILTER */}
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

                <select
                  value={checkInStatusFilter}
                  onChange={(e) => {
                    setCheckInStatusFilterFilter(e.target.value);
                    setPage(1);
                    handleChangeCheckInStatus(e.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-[#dbe4f0] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Check In Status</option>
                  <option value="1">On Time</option>
                  <option value="2">Late</option>
                </select>
              </div>
            </div>
          </div>
        </div>



        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-[#64748b]">Loading staff attendance records...</p>
            </div>
          ) : (
            <table className="w-full min-w-[1200px]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  {[
                    "Staff Name",
                    "Designation",
                    "Section",
                    "Date",
                    "Attendance",
                    "Check In Time",
                    "Check In Status",
                    "Check Out Time",
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
                {staffAttendance.map((record) => (
                  <tr key={record.empNo} className="transition hover:bg-[#f8fafc]">
                    {/* NAME */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] font-semibold text-[#2563eb]">
                          {record.employeeName.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-[#0f172a]">
                            {record.employeeName}
                          </p>

                          <p className="text-xs text-[#64748b]">
                            Staff ID #{record.empNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESIGNATION */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">
                      {record.designation}
                    </td>

                    {/* SECTION */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">
                      {record.section}
                    </td>

                    {/* DATE */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm text-[#334155]">
                      {record.date}
                    </td>

                    {/* ATTENDANCE */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${record.attendanceStatusId === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {record.attendanceStatusId === 1 ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}

                        {record.attendanceStatusId === 1 ? "Present" : "Absent"}
                      </div>
                    </td>

                    {/* CHECK IN */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">
                      {record.checkIn}
                    </td>

                    {/* CHECK IN STATUS */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${record.checkInStatus === 1
                          ? "bg-blue-100 text-blue-700"
                          : record.checkInStatus === 2 ? "bg-orange-100 text-orange-700" : ""
                          }`}
                      >
                        {record.checkInStatus === 1 ? "On Time" : record.checkInStatus === 2 ? "Late" : ""}
                      </div>
                    </td>

                    {/* CHECK OUT */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4 text-sm font-medium text-[#0f172a]">
                      {record.checkOut}
                    </td>

                    {/* CHECK OUT STATUS */}
                    <td className="border-b border-[#f1f5f9] px-6 py-4">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${record.checkOutStatus === 1
                          ? "bg-green-100 text-green-700"
                          : record.checkOutStatus === 2 ? "bg-yellow-100 text-yellow-700" : ""
                          }`}
                      >
                        {record.checkOutStatus === 1 ? "On Time" : record.checkOutStatus === 2 ? "Early" : ""}
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

                {staffAttendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center text-[#64748b]"
                    >
                      No Attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>


            </table>
          )}

        </div>

        {loading === false && (
          <>
            {/* FOOTER */}
            <div className="flex flex-col gap-4 border-t border-[#e2e8f0] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748b]">
                Showing{" "}
                <span className="font-semibold text-[#0f172a]">
                  {showRecords}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#0f172a]">
                  {totalStaff}
                </span>{" "}
                records
              </p>

              {/* PAGINATION */}
              <div className="items-center gap-2 overflow-x-scroll hidden md:flex">
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
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${page === index + 1
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
            <div className="space-y-4 md:hidden pb-4 px-4">

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                >
                  Previous
                </Button>

                <span>
                  <p className="text-sm text-[#64748b]">
                    Page{" "}
                    <span className="font-semibold text-[#0f172a]">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#0f172a]">
                      {totalPages}
                    </span>
                  </p>
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}
