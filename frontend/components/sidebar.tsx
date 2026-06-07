import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";

const Siderbar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <div className="flex justify-between items-center">
          <img src="/stevta-logo.png" height={80} width={80} alt="Logo" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-blue-900">STEVTA</h1>
            <h2 className="text-sm text-emerald-600">Management & Information System</h2>
          </div>
        </div>
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
    </aside>
  );
};

export default Siderbar;
