"use client";

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
    <Link href="/login" className="btn btn-ghost">
      Connexion
    </Link>
  );
}

export default ConnexionButton;
