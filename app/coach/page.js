import { ADMIN_EMAILS } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CoachDashboardPage() {
  const session = await auth();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";
  // Fetch all coach emails from the database
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
      {/* Coach dashboard content here */}
    </div>
  );
}
