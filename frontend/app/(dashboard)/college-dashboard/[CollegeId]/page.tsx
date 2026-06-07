import { redirect } from "next/navigation";
import React from "react";
import { CollegeIdClient } from "./client";

const CollegeIdPage = async () => {
  const user = {};
  if (!user) redirect("/sign-in");

  return <CollegeIdClient />;
};

export default CollegeIdPage;
