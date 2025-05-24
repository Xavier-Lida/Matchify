"use client";
import { MY_EMAIL } from "@/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardButton() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session || session.user?.email !== MY_EMAIL) {
    return null;
  }

  return (
    <Link href="/dashboard" className="btn btn-ghost">
      Tableau de bord
    </Link>
  );
}
