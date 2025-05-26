import Link from "next/link";

export default function NavigationButton({ route, name, onClick }) {
  return (
    <Link
      href={route}
      className="btn btn-ghost"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {name}
    </Link>
  );
}
