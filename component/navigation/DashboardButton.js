"use client";
import { ADMIN_EMAILS } from "@/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardButton({ onClick }) {
  const { data: session, status } = useSession();

  if (
    status === "loading" ||
    !session ||
    !session.user?.email ||
    !ADMIN_EMAILS.includes(session.user.email)
  ) {
    return null;
  }

  return (
    <Link
      href="/dashboard"
      className="btn btn-ghost"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      Tableau de bord
    </Link>
  );
}
