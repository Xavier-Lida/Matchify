import Link from "next/link";

export default function NavigationButton({ route, name }) {
  return (
    <Link href={route} className="btn btn-ghost">
      {name}
    </Link>
  );
}
