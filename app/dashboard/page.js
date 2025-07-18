import { ADMIN_EMAILS } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TeamManager from "@/component/dashboard/TeamManager";
import Dashboard from "@/component/dashboard/Dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (
    !session ||
    !session.user?.email ||
    !ADMIN_EMAILS.includes(session.user.email)
  ) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Dashboard />
    </div>
  );
}
