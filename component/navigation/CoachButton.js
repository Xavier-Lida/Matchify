"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ADMIN_EMAILS } from "@/constants";
import { useEffect, useState } from "react";

export default function CoachButton({ onClick }) {
  const { data: session, status } = useSession();
  const [isCoach, setIsCoach] = useState(false);

  useEffect(() => {
    async function checkCoach() {
      if (
        status === "authenticated" &&
        session?.user?.email &&
        !ADMIN_EMAILS.includes(session.user.email)
      ) {
        // Fetch coach emails from API
        try {
          const res = await fetch("/api/coaches");
          const coachEmails = await res.json();
          setIsCoach(coachEmails.includes(session.user.email));
        } catch {
          setIsCoach(false);
        }
      } else if (
        status === "authenticated" &&
        session?.user?.email &&
        ADMIN_EMAILS.includes(session.user.email)
      ) {
        setIsCoach(true);
      } else {
        setIsCoach(false);
      }
    }
    checkCoach();
  }, [session, status]);

  if (
    status === "loading" ||
    !session ||
    !session.user?.email ||
    !isCoach
  ) {
    return null;
  }

  return (
    <Link
      href="/coach"
      className="btn btn-ghost"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      Zone Coach
    </Link>
  );
}