import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { OverviewProperty } from "@/components/overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { DateFormat } from "@/components/date-format";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import Link from "next/link";
import ProfileItem from "@/components/profile-item";

const CollegeProfilePage = async () => {
  const user = {};
  if (!user) redirect("/sign-in");

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe4f0] bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#e2e8f0] bg-linear-to-r from-[#0f172a] to-[#1e3a8a] px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">College Profile</h2>

          <p className="mt-1 text-sm text-blue-100">
            Institution information and administrative details
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1e3a8a] shadow-sm transition hover:scale-105">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 p-6 xl:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="space-y-2">
          <ProfileItem label="DDO Code" value="KQ1234" />

          <ProfileItem label="College Type" value="Intermediate" />

          <ProfileItem label="College Region" value="Karachi" />

          <ProfileItem label="Subdivision / Tehsil / Town" value="Clifton" />

          <ProfileItem label="College Area Type" value="Urban" />

          <ProfileItem label="Phone Number" value="02199260243" />

          {/* Principal */}
          <div className="flex items-start justify-between gap-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <span className="min-w-[180px] text-sm font-medium text-[#64748b]">
              College Principal
            </span>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-bold text-[#2563eb]">
                M
              </div>

              <div>
                <p className="font-semibold text-[#0f172a]">
                  Mrs. Razia Sultana
                </p>

                <p className="text-xs text-[#64748b]">Principal</p>
              </div>
            </div>
          </div>

          {/* DDO */}
          <div className="flex items-start justify-between gap-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <span className="min-w-[180px] text-sm font-medium text-[#64748b]">
              College DDO
            </span>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-bold text-[#2563eb]">
                M
              </div>

              <div>
                <p className="font-semibold text-[#0f172a]">
                  Mrs. Razia Sultana
                </p>

                <p className="text-xs text-[#64748b]">DDO Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-2">
          <ProfileItem label="College Name" value="Adam Jee" />

          <ProfileItem label="College Shift" value="Morning" />

          <ProfileItem label="College District" value="Karachi South" />

          <ProfileItem label="UC Name" value="UC-10 Liaquatabad Town" />

          {/* Establishment */}
          <div className="flex items-center justify-between rounded-2xl border border-[#fee2e2] bg-[#fff1f2] p-4">
            <span className="text-sm font-medium text-[#64748b]">
              Year of Establishment
            </span>

            <span className="font-semibold text-[#dc2626]">
              January 1st, 1954
            </span>
          </div>

          <ProfileItem label="College Email" value="kq2160ssggc@gmail.com" />

          {/* Status */}
          <div className="flex items-center justify-between rounded-2xl border border-[#d1fae5] bg-[#f0fdf4] p-4">
            <span className="text-sm font-medium text-[#64748b]">
              Principal Status
            </span>

            <span className="inline-flex rounded-full bg-[#10b981] px-4 py-1 text-xs font-semibold text-white shadow-sm">
              Notified
            </span>
          </div>

          {/* IT Focal Person */}
          <div className="flex items-start justify-between gap-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <span className="min-w-[180px] text-sm font-medium text-[#64748b]">
              College IT Focal Person
            </span>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ede9fe] text-sm font-bold text-[#7c3aed]">
                S
              </div>

              <div>
                <p className="font-semibold text-[#0f172a]">Sarwat Jamal</p>

                <p className="text-xs text-[#64748b]">IT Focal Person</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfilePage;
