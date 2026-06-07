"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { Staff } from "../types";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
// import { TaskActions } from "./task-actions";

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "serialNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const serialNo = row.original.serialNo;

      return <p className="line-clamp-1">{serialNo}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Personnel no
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const personnelNo = row.original.personnelNo;

      return <p className="line-clamp-1">{personnelNo}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "fatherName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Father Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fatherName = row.original.fatherName;

      return <p className="line-clamp-1">{fatherName}</p>;
    },
  },
  {
    accessorKey: "designation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Designation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const designation = row.original.designation;

      return <p className="line-clamp-1">{designation}</p>;
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const subject = row.original.subject;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{subject}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "postingPlace",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posting Place
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const postingPlace = row.original.postingPlace;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{postingPlace}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "workingPlace",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Working Place
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const workingPlace = row.original.workingPlace;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{workingPlace}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "cnic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cnic
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cnic = row.original.cnic;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{cnic}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gender = row.original.gender;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{gender}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "qualification",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Qualification
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const qualification = row.original.qualification;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{qualification}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "domicileDistrict",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Domicile District
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const domicileDistrict = row.original.domicileDistrict;

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <p className="line-clamp-1">{domicileDistrict}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <div></div>
        // <TaskActions id={id} departmentId={departmentId}>
        //   <Button variant="ghost" className="size-8 p-0">
        //     <MoreVertical className="size-4" />
        //   </Button>
        // </TaskActions>
      );
    },
  },
];
