"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef } from "react";

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
} from "lucide-react";

const stats = [
  {
    title: "Sanctioned Posts",
    value: 900,
    icon: Briefcase,
    color: "border-blue-500 bg-blue-50 text-blue-600",
  },
  {
    title: "Working Staff",
    value: 750,
    icon: Users,
    color: "border-green-500 bg-green-50 text-green-600",
  },
  {
    title: "Vacant Posts",
    value: 150,
    icon: Building2,
    color: "border-orange-500 bg-orange-50 text-orange-600",
  },
  {
    title: "Present Staff",
    value: 500,
    icon: UserCheck,
    color: "border-purple-500 bg-purple-50 text-purple-600",
  },
  {
    title: "Absent Staff",
    value: 200,
    icon: UserX,
    color: "border-red-500 bg-red-50 text-red-600",
  },
  {
    title: "Staffs on Leave",
    value: 50,
    icon: CalendarDays,
    color: "border-amber-500 bg-amber-50 text-amber-600",
  },
  {
    title: "Public Servants",
    value: 500,
    icon: Building2,
    color: "border-cyan-500 bg-cyan-50 text-cyan-600",
  },
  {
    title: "Civil Servants",
    value: 200,
    icon: Shield,
    color: "border-indigo-500 bg-indigo-50 text-indigo-600",
  },
  {
    title: "Visiting Faculty",
    value: 50,
    icon: Users,
    color: "border-pink-500 bg-pink-50 text-pink-600",
  },
  {
    title: "Teaching Staff",
    value: 500,
    icon: GraduationCap,
    color: "border-emerald-500 bg-emerald-50 text-emerald-600",
  },
  {
    title: "Non-Teaching Staff",
    value: 250,
    icon: BookOpen,
    color: "border-orange-400 bg-orange-50 text-orange-500",
  },
  {
    title: "Male Staff",
    value: 600,
    icon: UserRound,
    color: "border-sky-500 bg-sky-50 text-sky-600",
  },
  {
    title: "Female Staff",
    value: 150,
    icon: Venus,
    color: "border-rose-500 bg-rose-50 text-rose-600",
  },
];

const holidays = [
  {
    title: "Independence Day",
    date: "14th August, 2026",
  },
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

export const CollegeIdClient = () => {
  const isLoading = false;

  const analytics = true;

  const dashboardRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics) {
    return <PageError message="Failed to load workspace data" />;
  }

  const downloadDashboard = async () => {
    const input = dashboardRef.current;

    if (!input) return;

    try {
      document.body.style.background = "#ffffff";

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,

        foreignObjectRendering: false, // IMPORTANT FIX

        onclone: (clonedDoc) => {
          const elements = clonedDoc.querySelectorAll("*");

          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;

            // Remove ALL modern color rendering issues
            htmlEl.style.color = "#000000";
            htmlEl.style.backgroundColor = "#ffffff";
            htmlEl.style.boxShadow = "none";
            htmlEl.style.borderColor = "#e2e8f0";
          });

          if (clonedDoc.body) {
            clonedDoc.body.style.background = "#ffffff";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // HEADER
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);

      pdf.text("Government HR Dashboard Report", pageWidth / 2, 18, {
        align: "center",
      });

      pdf.setFontSize(12);

      pdf.text("Department of Education & Establishment", pageWidth / 2, 26, {
        align: "center",
      });

      // DATE
      const today = new Date().toLocaleString();

      pdf.setFont("helvetica", "normal");

      pdf.text(`Generated: ${today}`, 14, 35);

      // LOGO
      const logo = new Image();

      logo.src = "/stevta-logo.png";

      await new Promise((resolve) => {
        logo.onload = resolve;
      });

      pdf.addImage(logo, "PNG", 160, 10, 30, 30);

      // WATERMARK
      pdf.saveGraphicsState();

      pdf.setGState(new (pdf as any).GState({ opacity: 0.05 }));

      pdf.addImage(logo, "PNG", 40, 70, 130, 130);

      pdf.restoreGraphicsState();

      // DASHBOARD IMAGE
      const imgWidth = 180;

      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pageHeightAvailable = 240;

      let heightLeft = imgHeight;

      let position = 45;

      pdf.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);

      heightLeft -= pageHeightAvailable;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 45;

        pdf.addPage();

        pdf.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);

        heightLeft -= pageHeightAvailable;
      }

      // FOOTER
      pdf.setFontSize(10);

      pdf.text("Confidential Government Report", 14, pageHeight - 10);

      pdf.text(`Page 1`, pageWidth - 30, pageHeight - 10);

      // SIGNATURE
      pdf.setFontSize(11);

      pdf.text(
        "Authorized Signature: ____________________",
        14,
        pageHeight - 25,
      );

      pdf.save("government-dashboard-report.pdf");
    } catch (error) {
      console.error(error);
    } finally {
      document.body.style.background = "";
    }
  };

  return (
    <div className="relative bg-white">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/stevta-logo.png"
          className="h-14 w-auto"
          style={{ height: "56px", width: "auto" }}
        />
      </div>

      {/* Dashboard */}
      <div className="relative z-10">
        <div ref={dashboardRef} className="min-h-screen p-6 bg-[#f8fafc]">
          {/* HEADER */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] shadow-xl">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <button
                onClick={downloadDashboard}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1e3a8a] shadow-md transition hover:scale-105"
              >
                <Download size={16} />
                Download Report
              </button>

              <img
                src="/stevta-logo.png"
                className="h-14 w-auto"
                style={{ height: "56px", width: "auto" }}
              />
            </div>

            {/* HEADER CONTENT */}
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <Building2 className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Dashboard Overview
                  </h1>

                  <p className="mt-1 text-sm text-blue-100">
                    HR & Establishment Summary
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <div>
                  <p className="text-xs text-blue-100">Section</p>

                  <p className="text-sm font-semibold text-white">
                    HR
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-100">Fiscal Year</p>

                  <p className="text-sm font-semibold text-white">2026-2027</p>
                </div>

                <div>
                  <p className="text-xs text-blue-100">Generated By</p>

                  <p className="text-sm font-semibold text-white">
                    STEVTA H.Q Admin
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-100">Date</p>

                  <p className="text-sm font-semibold text-white">
                    May 22, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
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
                        {item.value}
                      </h2>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM SECTION */}
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
                {holidays.map((holiday, index) => (
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
                ))}
              </div>
            </div>

            {/* RETIREMENTS */}
            <div className="rounded-3xl border border-[#ffe4e6] bg-gradient-to-br from-[#fff1f2] to-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                  <Users className="text-rose-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-rose-700">
                    Upcoming Retirements
                  </h2>

                  <p className="text-xs text-[#64748b]">
                    Staff retiring this year
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {retirements.map((retirement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-[#ffe4e6] bg-white p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium text-[#334155]">
                        {retirement.name}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-[#475569]">
                      {retirement.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
