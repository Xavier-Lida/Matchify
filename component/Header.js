"use client";

import ConnexionButton from "./ConnexionButton";
import DashboardButton from "./DashboardButton";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();

  return (
    <nav className="navbar bg-base-100 shadow-sm fixed z-50 w-full">
      <div className="navbar-start">
        {/* Hamburger menu for mobile */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href={ROUTES.HOMEPAGE}>Horaire</Link>
            </li>
            <li>
              <DashboardButton />
            </li>
            <li>
              <ConnexionButton />
            </li>
            {/* Ajoute d'autres liens ici si besoin */}
          </ul>
        </div>
        {/* Logo ou titre (non cliquable, hover opacity) */}
        <span className="ml-2 text-xl font-bold transition-opacity opacity-90 hover:opacity-60 select-none cursor-default">
          Matchify
        </span>
      </div>
      {/* Les boutons passent à droite sur desktop */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold flex gap-4">
          <li>
            <Link href={ROUTES.HOMEPAGE}>Horaire</Link>
          </li>
          <li>
            <DashboardButton />
          </li>
          <li>
            <ConnexionButton />
          </li>
          {/* Ajoute d'autres liens ici si besoin */}
        </ul>
      </div>
    </nav>
  );
}

export default Header;