import { ADMIN_EMAILS } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardCoach from "@/component/dashboard/DashboardCoach";

export default async function CoachDashboardPage() {
  try {
    const session = await auth();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/coaches`, { cache: "no-store" });
    const coachEmails = await res.json();

    const userEmail = session?.user?.email;

    if (
      !session ||
      !userEmail ||
      (!ADMIN_EMAILS.includes(userEmail) && !coachEmails.includes(userEmail))
    ) {
      redirect("/login");
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <DashboardCoach userEmail={userEmail} />
      </div>
    );
  } catch (err) {
    console.error("CoachDashboardPage error:", err);
    // Optionally show a fallback UI or redirect
    redirect("/login");
  }
}
