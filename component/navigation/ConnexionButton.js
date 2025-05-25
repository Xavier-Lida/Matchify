"use client";
import NavigationButton from "./NavigationButton";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function ConnexionButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return session ? (
    <button onClick={() => signOut()} className="btn btn-ghost">
      Déconnexion
    </button>
  ) : (
    <NavigationButton route="/login" name="Connexion" />
  );
}

export default ConnexionButton;
