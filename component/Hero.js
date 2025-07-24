"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/constants";

function Hero() {
  const { data: session } = useSession();

  // If logged in, go to schedule, else go to login
  const buttonHref = session ? ROUTES.SCHEDULE : ROUTES.LOGIN;

  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Matchify</h1>
          <p className="py-4">
            <span className="text-lg font-bold">
              Site officiel de la Ligue Fustal Mauricie.
            </span>
            <br />
            Pour suivre les matchs, les classements, les statistiques et faire
            vos prédictions!
          </p>
          <Link href={buttonHref} className="btn btn-primary btn-xl">
            Commencer
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Hero;
