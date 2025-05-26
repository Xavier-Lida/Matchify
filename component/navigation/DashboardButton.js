"use client";
import { MY_EMAIL, ROUTES } from "@/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardButton({ onClick }) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session || session.user?.email !== MY_EMAIL) {
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
