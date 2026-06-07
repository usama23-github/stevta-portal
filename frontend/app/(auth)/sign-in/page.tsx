import React from "react";
import SignInCard from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = undefined;

  if (user) redirect("/");
  return (
    <div>
      <SignInCard />
    </div>
  );
};

export default SignInPage;
