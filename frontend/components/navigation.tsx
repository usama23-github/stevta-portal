"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import {
  GoCheckCircle,
  GoCheckCircleFill,
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
  ClipboardCheck
} from "lucide-react";

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
    activeIcon: GoOrganization, // style-based active
  },
  {
    label: "Staffs",
    href: "/staffs",
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
    label: "Leaves",
    href: "/leaves",
    icon: CalendarMinus,
    activeIcon: CalendarMinus,
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

export const Navigation = () => {
  const workspaceId = 1;
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/college-dashboard/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
