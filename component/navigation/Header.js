"use client";

import { useState } from "react";
import ConnexionButton from "./ConnexionButton";
import NavigationButton from "./NavigationButton";
import Dropdown from "./Dropdown";
import { ROUTES } from "@/constants";
import { useSession } from "next-auth/react";
import Hamburger from "./Hamburger";

function Header() {
  const { data: session } = useSession();

  return (
    <nav className="navbar bg-base-100 shadow-sm fixed z-50 w-full flex justify-center">
      <div className="w-8/10 h-full flex items-center">
        <div className="navbar-start">
          <Hamburger />
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
            <Dropdown />
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
