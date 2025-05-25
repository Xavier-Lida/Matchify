"use client";

import ConnexionButton from "./ConnexionButton";
import DashboardButton from "./DashboardButton";
import NavigationButton from "./NavigationButton";
import { ROUTES } from "@/constants";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();

  return (
    <nav className="navbar bg-base-100 shadow-sm fixed z-50 w-full flex justify-center">
      <div className="w-8/10 h-full flex items-center">
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
                <NavigationButton route={ROUTES.HOMEPAGE} name="Accueil" />
              </li>
              <li>
                <NavigationButton route={ROUTES.SCHEDULE} name="Horaire" />
              </li>
              <li>
                <NavigationButton
                  route={ROUTES.LEADERBOARD}
                  name="Classement"
                />
              </li>
              <li>
                <DashboardButton />
              </li>
              <li>
                <ConnexionButton />
              </li>
            </ul>
          </div>
          {/* Logo ou titre */}
          <span className="pl-2 text-3xl font-bold text-neutral transition-all hover:text-4xl select-none cursor-default">
            Matchify
          </span>
        </div>
        {/* Les boutons passent à droite sur desktop */}
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-semibold flex gap-4 items-center">
            <li>
              <NavigationButton route={ROUTES.HOMEPAGE} name="Accueil" />
            </li>
            {/* Dropdown menu */}
            <li tabIndex={0} className="relative dropdown dropdown-start">
              <details>
                <summary className="btn btn-ghost">Menu</summary>
                <ul className="dropdown-content shadow menu bg-base-100 rounded-box w-40 z-50">
                  <li>
                    <NavigationButton route={ROUTES.SCHEDULE} name="Horaire" />
                  </li>
                  <li>
                    <NavigationButton
                      route={ROUTES.LEADERBOARD}
                      name="Classement"
                    />
                  </li>
                  <li>
                    <DashboardButton />
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <ConnexionButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
