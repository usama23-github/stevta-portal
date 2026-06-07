import { redirect } from "next/navigation";

export default async function Home() {
  const user = {};
  if (!user) redirect("/sign-in");

  const collegeId = 1;
  if (collegeId === 1) {
    redirect(`/college-dashboard/${collegeId}`);
  } else {
    redirect(`/college-dashboard/${collegeId}`);
  }
}
