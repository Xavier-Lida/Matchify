import { useState, useRef, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import DashboardButton from "./DashboardButton";
import ConnexionButton from "./ConnexionButton";
import { ROUTES } from "@/constants";

export default function Hamburger() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleMenuClick = (callback) => () => {
    setDropdownOpen(false);
    if (callback) callback();
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Hamburger menu for mobile */}
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle lg:hidden"
        onClick={() => setDropdownOpen((open) => !open)}
      >
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
      {dropdownOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <NavigationButton
              route={ROUTES.HOMEPAGE}
              name="Accueil"
              onClick={handleMenuClick()}
            />
          </li>
          <li>
            <NavigationButton
              route={ROUTES.SCHEDULE}
              name="Horaire"
              onClick={handleMenuClick()}
            />
          </li>
          <li>
            <NavigationButton
              route={ROUTES.LEADERBOARD}
              name="Classement"
              onClick={handleMenuClick()}
            />
          </li>
          <li>
            <DashboardButton onClick={handleMenuClick()} />
          </li>
          <li>
            <ConnexionButton onClick={handleMenuClick()} />
          </li>
        </ul>
      )}
    </div>
  );
}
