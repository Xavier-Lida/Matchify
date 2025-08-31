"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/constants";

function Hero() {
  const { data: session } = useSession();
  const buttonHref = session ? ROUTES.SCHEDULE : ROUTES.LOGIN;

  return (
    <div
      className="hero min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Top fade towards #ddf2ff */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "15vh",
          background:
            "linear-gradient(to bottom, var(--color-base-200) 80%, transparent 100%)",
          zIndex: 1,
        }}
      />
      <div className="w-full bg-primary/60 bg-opacity-90 py-16 flex justify-center items-center relative z-10">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white">Saison 2025-2026</h1>
          <p className="py-4 text-white">
            <span className="text-lg font-bold">
              Site officiel de la Ligue Fustal Mauricie.
            </span>
            <br />
            Pour suivre les matchs, les classements, les statistiques et faire
            vos prédictions!
          </p>
        </div>
      </div>
    </div>
  );
}
export default Hero;
