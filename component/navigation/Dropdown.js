import { useState, useRef, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import DashboardButton from "./DashboardButton";
import CoachButton from "./CoachButton";
import { ROUTES } from "@/constants";
import { useSession } from "next-auth/react";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session, status } = useSession();
  const [isCoach, setIsCoach] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    async function checkRoles() {
      if (status === "authenticated" && session?.user?.email) {
        // Check admin
        const adminEmails = (await import("@/constants")).ADMIN_EMAILS;
        setIsAdmin(adminEmails.includes(session.user.email));

        // Check coach
        if (!adminEmails.includes(session.user.email)) {
          try {
            const res = await fetch("/api/coaches");
            const coachEmails = await res.json();
            setIsCoach(coachEmails.includes(session.user.email));
          } catch {
            setIsCoach(false);
          }
        } else {
          setIsCoach(true); // Admins are also considered coaches for menu
        }
      } else {
        setIsCoach(false);
        setIsAdmin(false);
      }
    }
    checkRoles();
  }, [session, status]);

  const handleMenuClick = (callback) => () => {
    setOpen(false);
    if (callback) callback();
  };

  // Build menu items based on user role
  const menuItems = [
    <li key="schedule">
      <NavigationButton
        route={ROUTES.SCHEDULE}
        name="Horaire"
        onClick={handleMenuClick()}
      />
    </li>,
    <li key="leaderboard">
      <NavigationButton
        route={ROUTES.LEADERBOARD}
        name="Classement"
        onClick={handleMenuClick()}
      />
    </li>,
  ];

  if (isCoach) {
    menuItems.push(
      <li key="coach">
        <CoachButton onClick={handleMenuClick()} />
      </li>
    );
  }
  if (isAdmin) {
    menuItems.push(
      <li key="dashboard">
        <DashboardButton onClick={handleMenuClick()} />
      </li>
    );
  }

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
          {menuItems}
        </ul>
      )}
    </li>
  );
}
