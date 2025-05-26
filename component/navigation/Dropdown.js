import { useState, useRef, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import DashboardButton from "./DashboardButton";
import { ROUTES } from "@/constants";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Helper to close dropdown and (optionally) do something else
  const handleMenuClick = (callback) => () => {
    setOpen(false);
    if (callback) callback();
  };

  return (
    <li className="relative dropdown dropdown-start" ref={dropdownRef}>
      <button
        className="btn btn-ghost flex items-center gap-2"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Menu
        <svg
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>
      {open && (
        <ul className="dropdown-content shadow menu bg-gray-50 rounded-box w-40 z-50 absolute left-0 mt-2">
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
        </ul>
      )}
    </li>
  );
}
