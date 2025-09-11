import { ADMIN_EMAILS } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardCoach from "@/component/dashboard/DashboardCoach";

export default async function CoachDashboardPage() {
  try {
    const session = await auth();

    // Use relative URL for API route
    const res = await fetch("/api/coaches", { cache: "no-store" });
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
    redirect("/login");
  }
}
