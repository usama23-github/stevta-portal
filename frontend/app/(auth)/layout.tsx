"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="flex flex-col items-center justify-center pt-4 md:pt-10">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
