"use client";
import NavigationButton from "./NavigationButton";
import { MY_EMAIL, ROUTES } from "@/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardButton() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session || session.user?.email !== MY_EMAIL) {
    return null;
  }

  return <NavigationButton route={ROUTES.DASHBOARD} name="Tableau de bord" />;
}
