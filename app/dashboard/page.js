import { MY_EMAIL } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user?.email !== MY_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen algin-center">
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.email}!</p>
    </div>
  );
}
