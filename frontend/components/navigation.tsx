"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  GoHome,
  GoHomeFill,
  GoOrganization,
} from "react-icons/go";

import {
  Users,
  Settings,
  CalendarCheck,
  CalendarMinus,
  ArrowLeftRight,
  ClipboardCheck,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  CircleCheck,
  CircleX,
  WalletCards,
  ListChecks,
} from "lucide-react";

// ======================================================
// NAVIGATION ROUTES
// ======================================================

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },

  {
    label: "College Profile",
    href: "/college-profile",
    icon: GoOrganization,
    activeIcon: GoOrganization,
  },

  {
    label: "Staff",
    href: "/staff",
    icon: Users,
    activeIcon: Users,
  },

  {
    label: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    activeIcon: CalendarCheck,
  },

  {
    label: "Attendance Reports",
    href: "/attendance-reports",
    icon: CalendarDays,
    activeIcon: CalendarDays,
  },

  // ====================================================
  // LEAVE MANAGEMENT
  // ====================================================

  {
    label: "Leave Management",
    href: "/leave-management",
    icon: CalendarMinus,
    activeIcon: CalendarMinus,

    children: [
      {
        label: "Leave Records",
        href: "/leave-management",
        icon: LayoutDashboard,
      },

      {
        label: "Mark Leave",
        href: "/leave-management/mark-leave",
        icon: FilePlus2,
      },

      {
        label: "Leave Accounts",
        href: "/leave-management/accounts",
        icon: WalletCards,
      },

      {
        label: "Leave Types",
        href: "/leave-management/types",
        icon: ListChecks,
      },
    ],
  },

  {
    label: "Sanctioned Posts",
    href: "/sanctioned-posts",
    icon: ClipboardCheck,
    activeIcon: ClipboardCheck,
  },

  {
    label: "Transfers",
    href: "/transfers",
    icon: ArrowLeftRight,
    activeIcon: ArrowLeftRight,
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    activeIcon: Settings,
  },
];

// ======================================================
// NAVIGATION COMPONENT
// ======================================================

export const Navigation = () => {
  const workspaceId = 1;
  const pathname = usePathname();

  // ====================================================
  // LEAVE MANAGEMENT ACTIVE
  // ====================================================

  const leaveBasePath =
    `/ college - dashboard / ${workspaceId}/leave-management`;

  const isLeaveActive =
    pathname === leaveBasePath ||
    pathname.startsWith(`${leaveBasePath}/`);

  // Automatically open Leave Management
  // when one of its pages is active.
  const [openLeave, setOpenLeave] =
    useState(isLeaveActive);

  return (
    <nav className="space-y-1">

      {routes.map((item) => {
        const fullHref =
          `/college-dashboard/${workspaceId}${item.href}`;

        const hasChildren =
          item.children &&
          item.children.length > 0;

        const isActive =
          pathname === fullHref;

        // ==================================================
        // PARENT MENU WITH CHILDREN
        // ==================================================

        if (hasChildren) {
          const Icon =
            isLeaveActive
              ? item.activeIcon
              : item.icon;

          return (
            <div key={item.href}>

              {/* ==========================================
                  PARENT BUTTON
              ========================================== */}

              <button
                type="button"
                onClick={() =>
                  setOpenLeave((prev) => !prev)
                }
                className={cn(
                  "flex w-full items-center justify-between",
                  "rounded-md p-2.5",
                  "font-medium transition",
                  "text-neutral-500",
                  "hover:bg-white hover:text-primary",

                  isLeaveActive &&
                  "bg-white text-primary shadow-sm"
                )}
              >

                <div className="flex items-center gap-2.5">

                  <Icon className="size-5 shrink-0" />

                  <span>
                    {item.label}
                  </span>

                </div>

                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    openLeave && "rotate-180"
                  )}
                />

              </button>

              {/* ==========================================
                  SUB NAVIGATION
              ========================================== */}

              {openLeave && (
                <div className="relative ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-3">

                  {item.children?.map((child) => {

                    const childHref =
                      `/college-dashboard/${workspaceId}${child.href}`;

                    const childActive =
                      pathname === childHref;

                    const ChildIcon =
                      child.icon;

                    return (
                      <Link
                        key={child.href}
                        href={childHref}
                        className="block"
                      >

                        <div
                          className={cn(
                            "flex items-center gap-2.5",
                            "rounded-md px-3 py-2",
                            "text-sm font-medium",
                            "transition",

                            "text-neutral-500",
                            "hover:bg-white",
                            "hover:text-primary",

                            childActive &&
                            "bg-white text-primary shadow-sm"
                          )}
                        >

                          <ChildIcon
                            className={cn(
                              "size-4 shrink-0",

                              childActive
                                ? "text-primary"
                                : "text-neutral-400"
                            )}
                          />

                          <span>
                            {child.label}
                          </span>

                        </div>

                      </Link>
                    );
                  })}

                </div>
              )}

            </div>
          );
        }

        // ==================================================
        // NORMAL NAVIGATION ITEM
        // ==================================================

        const Icon =
          isActive
            ? item.activeIcon
            : item.icon;

        return (
          <Link
            key={item.href}
            href={fullHref}
            className="block"
          >

            <div
              className={cn(
                "flex items-center gap-2.5",
                "rounded-md p-2.5",
                "font-medium transition",

                "text-neutral-500",
                "hover:bg-white",
                "hover:text-primary",

                isActive &&
                "bg-white text-primary shadow-sm"
              )}
            >

              <Icon
                className={cn(
                  "size-5 shrink-0",

                  isActive
                    ? "text-primary"
                    : "text-neutral-500"
                )}
              />

              <span>
                {item.label}
              </span>

            </div>

          </Link>
        );
      })}

    </nav>
  );
};

