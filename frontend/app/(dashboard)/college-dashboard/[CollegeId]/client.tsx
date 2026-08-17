"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

import {
  Briefcase,
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  GraduationCap,
  Shield,
  Building2,
  UserRound,
  BookOpen,
  Venus,
  Download,
  Clock,
  LogOut,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const formattedDate = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

// const stats = [
//   {
//     title: "Sanctioned Posts",
//     value: 900,
//     icon: Briefcase,
//     color: "border-blue-500 bg-blue-50 text-blue-600",
//   },
//   {
//     title: "Working Staff",
//     value: 750,
//     icon: Users,
//     color: "border-green-500 bg-green-50 text-green-600",
//   },
//   {
//     title: "Vacant Posts",
//     value: 150,
//     icon: Building2,
//     color: "border-orange-500 bg-orange-50 text-orange-600",
//   },
//   {
//     title: "Present Staff",
//     value: 500,
//     icon: UserCheck,
//     color: "border-purple-500 bg-purple-50 text-purple-600",
//   },
//   {
//     title: "Absent Staff",
//     value: 200,
//     icon: UserX,
//     color: "border-red-500 bg-red-50 text-red-600",
//   },
//   {
//     title: "Staffs on Leave",
//     value: 50,
//     icon: CalendarDays,
//     color: "border-amber-500 bg-amber-50 text-amber-600",
//   },
//   {
//     title: "Public Servants",
//     value: 500,
//     icon: Building2,
//     color: "border-cyan-500 bg-cyan-50 text-cyan-600",
//   },
//   {
//     title: "Civil Servants",
//     value: 200,
//     icon: Shield,
//     color: "border-indigo-500 bg-indigo-50 text-indigo-600",
//   },
//   {
//     title: "Visiting Faculty",
//     value: 50,
//     icon: Users,
//     color: "border-pink-500 bg-pink-50 text-pink-600",
//   },
//   {
//     title: "Teaching Staff",
//     value: 500,
//     icon: GraduationCap,
//     color: "border-emerald-500 bg-emerald-50 text-emerald-600",
//   },
//   {
//     title: "Non-Teaching Staff",
//     value: 250,
//     icon: BookOpen,
//     color: "border-orange-400 bg-orange-50 text-orange-500",
//   },
//   {
//     title: "Male Staff",
//     value: 600,
//     icon: UserRound,
//     color: "border-sky-500 bg-sky-50 text-sky-600",
//   },
//   {
//     title: "Female Staff",
//     value: 150,
//     icon: Venus,
//     color: "border-rose-500 bg-rose-50 text-rose-600",
//   },
// ];

const stats = [
  {
    title: "Total Employees",
    value: 750,
    icon: Users,
    color: "border-blue-500 bg-blue-50 text-blue-600",
  },
  {
    title: "Present",
    value: 500,
    icon: UserCheck,
    color: "border-green-500 bg-green-50 text-green-600",
  },
  {
    title: "Absent",
    value: 200,
    icon: UserX,
    color: "border-red-500 bg-red-50 text-red-600",
  },
  {
    title: "On Leave",
    value: 50,
    icon: CalendarDays,
    color: "border-amber-500 bg-amber-50 text-amber-600",
  },
  {
    title: "Late Check-in",
    value: 35,
    icon: Clock,
    color: "border-orange-500 bg-orange-50 text-orange-600",
  },
  {
    title: "Early Checkout",
    value: 25,
    icon: LogOut,
    color: "border-purple-500 bg-purple-50 text-purple-600",
  },
];

const attendanceData = [
  {
    name: "Present",
    value: 500,
  },
  {
    name: "Absent",
    value: 200,
  },
  {
    name: "On Leave",
    value: 50,
  },
];

const departmentAbsentData = [
  {
    department: "Administration",
    total: 120,
    absent: 28,
  },
  {
    department: "Finance",
    total: 80,
    absent: 18,
  },
  {
    department: "HR",
    total: 60,
    absent: 12,
  },
  {
    department: "IT",
    total: 50,
    absent: 9,
  },
  {
    department: "Operations",
    total: 180,
    absent: 35,
  },
  {
    department: "Procurement",
    total: 70,
    absent: 14,
  },
  {
    department: "Training",
    total: 90,
    absent: 22,
  },
];

const last7DaysAbsentData = [
  {
    date: "Aug 4",
    total: 750,
    absent: 185,
  },
  {
    date: "Aug 5",
    total: 750,
    absent: 172,
  },
  {
    date: "Aug 6",
    total: 750,
    absent: 201,
  },
  {
    date: "Aug 7",
    total: 750,
    absent: 164,
  },
  {
    date: "Aug 8",
    total: 750,
    absent: 193,
  },
  {
    date: "Aug 9",
    total: 750,
    absent: 178,
  },
  {
    date: "Aug 10",
    total: 750,
    absent: 200,
  },
];

const attendanceColors = [
  "#22c55e", // Present
  "#ef4444", // Absent
  "#f59e0b", // On Leave
];

const holidays = [
  // {
  //   title: "Independence Day",
  //   date: "14th August, 2026",
  // },
  {
    title: "Quaid-e-Azam Day",
    date: "25th December, 2026",
  },
  {
    title: "Death anniversary of Benazir Bhutto",
    date: "27th December, 2026",
  },
];

const retirements = [
  {
    name: "Ali Raza PROFESSOR (BPS-20)",
    date: "3rd June, 2026",
  },
  {
    name: "Usman Khan PROFESSOR (BPS-20)",
    date: "22nd July, 2026",
  },
  {
    name: "Maqsood Ali PROFESSOR (BPS-20)",
    date: "19th August, 2026",
  },
];

type DashboardAttendance = {
  totalEmployees: number;
  present: number;
  absent: number;
  onLeave: number;
  lateCheckIn: number;
  earlyCheckout: number;
};

type SectionAttendance = {
  sectionId: number;
  section: string;
  total: number;
  present: number;
  absent: number;
  onLeave: number;
  lateCheckIn: number;
  earlyCheckout: number;
  absencePercentage: number;
};

type DepartmentAttendance = {
  departmentId: number;
  department: string;
  total: number;
  present: number;
  absent: number;
  onLeave: number;
  lateCheckIn: number;
  earlyCheckout: number;
  absencePercentage: number;
};

type Last7DayAttendance = {
  date: string;
  total: number;
  absent: number;
  absencePercentage: number;
};

type DashboardResponse = {
  success: boolean;
  data: {
    attendance: DashboardAttendance;
    departmentWise: DepartmentAttendance[];
    sectionWise: SectionAttendance[];
    last7Days: Last7DayAttendance[];
  };
};

export const CollegeIdClient = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse["data"] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://portal.stevta.gos.pk/api/v1";

      const response = await fetch(
        `${apiUrl}/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch dashboard data"
        );
      }

      const result: DashboardResponse =
        await response.json();

      if (!result.success) {
        throw new Error(
          "Dashboard API returned an error"
        );
      }

      const updatedData = {
        ...result.data,

        departmentWise: result.data.departmentWise.map((item) => ({
          ...item,
          department:
            item.department === "Industrial Linkages / Public Private Partnership"
              ? "IL / PPP"
              : item.department === "Management Information System (MIS)" ? "MIS"
                : item.department === "Managing Director Secretariat" ? "MD Secretariat"
                  : item.department,
        })),
      };

      setDashboardData(updatedData);

    } catch (error) {
      console.error(
        "Dashboard API Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !dashboardData) {
    return (
      <PageError
        message={
          error ||
          "Failed to load dashboard data"
        }
      />
    );
  }

  const {
    attendance,
    departmentWise,
    sectionWise,
    last7Days,
  } = dashboardData;

  const stats = [
    {
      title: "Total Employees",
      value: attendance.totalEmployees,
      icon: Users,
      color:
        "border-blue-500 bg-blue-50 text-blue-600",
    },
    {
      title: "Present",
      value: attendance.present,
      icon: UserCheck,
      color:
        "border-green-500 bg-green-50 text-green-600",
    },
    {
      title: "Absent",
      value: attendance.absent,
      icon: UserX,
      color:
        "border-red-500 bg-red-50 text-red-600",
    },
    {
      title: "On Leave",
      value: attendance.onLeave,
      icon: CalendarDays,
      color:
        "border-amber-500 bg-amber-50 text-amber-600",
    },
    {
      title: "Late Check-in",
      value: attendance.lateCheckIn,
      icon: Clock,
      color:
        "border-orange-500 bg-orange-50 text-orange-600",
    },
    {
      title: "Early Checkout",
      value: attendance.earlyCheckout,
      icon: LogOut,
      color:
        "border-purple-500 bg-purple-50 text-purple-600",
    },
  ];

  const attendanceData = [
    {
      name: "Present",
      value: attendance.present,
    },
    {
      name: "Absent",
      value: attendance.absent,
    },
    {
      name: "Late Check-in",
      value: attendance.lateCheckIn,
    },
  ];

  const attendanceColors = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];

  return (
    <div className="relative bg-white">

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/stevta-logo.png"
          className="h-14 w-auto"
          style={{
            height: "56px",
            width: "auto",
          }}
          alt="STEVTA"
        />
      </div>

      {/* Dashboard */}
      <div className="relative z-10">

        <div
          ref={dashboardRef}
          className="min-h-screen bg-[#f8fafc] p-6"
        >

          {/* ============================= */}
          {/* HEADER */}
          {/* ============================= */}

          <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] shadow-xl">

            {/* <div className="flex items-center justify-between border-b border-white/10 p-4">

              <div />

              <img
                src="/stevta-logo.png"
                className="h-14 w-auto"
                style={{
                  height: "56px",
                  width: "auto",
                }}
                alt="STEVTA"
              />

            </div> */}

            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

                  <Building2 className="h-8 w-8 text-white" />

                </div>

                <div>

                  <h1 className="text-3xl font-bold text-white">
                    Attendance Information at a Glance
                  </h1>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">

                <div>
                  <p className="text-xs text-blue-100">
                    Date
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {formattedDate}
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* ============================= */}
          {/* OFFICE */}
          {/* ============================= */}

          <div className="mb-6 overflow-hidden rounded-3xl bg-[#1e3a8a] shadow">

            <div className="p-8">

              <h1 className="text-xl font-bold text-white">
                STEVTA Headquarter, Karachi
              </h1>

            </div>

          </div>

          {/* ============================= */}
          {/* STATS */}
          {/* ============================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {stats.map((item, index) => {

              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`group rounded-3xl border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-[#64748b]">
                        {item.title}
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-[#1e293b]">
                        {item.value.toLocaleString()}
                      </h2>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ============================= */}
          {/* ATTENDANCE ANALYTICS */}
          {/* ============================= */}

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* ============================= */}
            {/* DONUT */}
            {/* ============================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-4">

                <h2 className="text-lg font-bold text-slate-800">
                  Today's Attendance
                </h2>

                <p className="text-sm text-slate-500">
                  Overall attendance distribution
                </p>

              </div>

              <div className="relative h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={115}
                      paddingAngle={3}
                      dataKey="value"
                    >

                      {attendanceData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              attendanceColors[
                              index
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        padding: "10px 14px",
                        zIndex: 1000,
                      }}
                      labelStyle={{
                        // color: "#334155",
                        fontWeight: 600,
                      }}
                      itemStyle={{
                        // color: "#0f172a",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                      formatter={(value, name) => [
                        `${value} Employees`,
                        name,
                      ]}
                    />

                    {/* <Tooltip
                      formatter={(value) => [
                        `${value} Employees`,
                        "Attendance",
                      ]}
                    /> */}

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                    />

                  </PieChart>

                </ResponsiveContainer>

                {/* CENTER VALUE */}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                  <div className="text-center">

                    <p className="text-3xl font-bold text-slate-800">
                      {attendance.totalEmployees.toLocaleString()}
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      Total Employees
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ============================= */}
            {/* SECTION-WISE ATTENDANCE */}
            {/* ============================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="mb-4">

                <h2 className="text-lg font-bold text-slate-800">
                  Today's Attendance by Department
                </h2>

                <p className="text-sm text-slate-500">
                  Total employees and absent employees by department
                </p>

              </div>

              <div className="h-[350px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={departmentWise}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="department"
                      width={140}
                      tick={{
                        fontSize: 10,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value,
                        name,
                        props
                      ) => {

                        const row =
                          props.payload;

                        if (
                          name === "Absent"
                        ) {
                          return [
                            `${value} Employees (${row.absencePercentage}%)`,
                            "Absent",
                          ];
                        }

                        return [
                          `${value} Employees`,
                          "Total Employees",
                        ];
                      }}
                    />

                    <Legend />

                    {/* ABSENT */}

                    <Bar
                      dataKey="absent"
                      name="Absent"
                      stackId="attendance"
                      fill="#ef4444"
                      barSize={24}
                    />

                    {/* TOTAL */}

                    <Bar
                      dataKey="total"
                      name="Total Employees"
                      stackId="attendance"
                      fill="#3b82f6"
                      barSize={24}
                      radius={[
                        0,
                        6,
                        6,
                        0,
                      ]}
                    />



                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* ============================= */}
          {/* LAST 7 DAYS */}
          {/* ============================= */}

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  Attendance Trend — Last 7 Days
                </h2>

                <p className="text-sm text-slate-500">
                  Daily total and absent employees
                </p>

              </div>

              <div className="rounded-xl bg-red-50 px-4 py-2">

                <p className="text-xs text-red-500">
                  Today's Absence
                </p>

                <p className="text-lg font-bold text-red-600">
                  {attendance.absent.toLocaleString()}
                </p>

              </div>

            </div>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={last7Days}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      new Date(
                        value
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )
                    }
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(
                        value
                      ).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    }
                    formatter={(
                      value,
                      name
                    ) => [
                        `${value} Employees`,
                        name ===
                          "Total Employees"
                          ? "Total Employees"
                          : "Absent Employees",
                      ]}
                  />

                  <Legend />

                  {/* TOTAL EMPLOYEES */}

                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Employees"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  {/* ABSENT */}

                  <Line
                    type="monotone"
                    dataKey="absent"
                    name="Absent Employees"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* ============================= */}
        {/* BOTTOM SECTION */}
        {/* ============================= */}

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* HOLIDAYS */}

          <div className="rounded-3xl border border-[#d1fae5] bg-gradient-to-br from-[#f0fdf4] to-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">

                <CalendarDays className="text-green-600" />

              </div>

              <div>

                <h2 className="text-lg font-bold text-green-700">
                  Upcoming Holidays
                </h2>

                <p className="text-xs text-[#64748b]">
                  National & Public Holidays
                </p>

              </div>

            </div>

            <div className="space-y-4">

              {holidays.map(
                (holiday, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-[#d1fae5] bg-white p-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium text-[#334155]">
                        {holiday.title}
                      </p>

                    </div>

                    <span className="text-sm font-semibold text-[#475569]">
                      {holiday.date}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
