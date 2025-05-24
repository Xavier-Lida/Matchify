import { MY_EMAIL } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/component/dashboard/Dashboard";
import Sidebar from "@/component/dashboard/Sidebar";
import TeamManager from "@/component/dashboard/TeamManager";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user?.email !== MY_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Sidebar />
      <TeamManager />
    </div>
  );
}
