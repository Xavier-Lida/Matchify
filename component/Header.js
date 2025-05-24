import ConnexionButton from "./ConnexionButton";
import DashboardButton from "./DashboardButton";
import Link from "next/link";

function Header() {
  return (
    <div className="fixed navbar bg-base-100 shadow-sm justify-center z-100">
      <div className="flex w-8/10 h-full items-center">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-semibold hover:opacity-90">
            Matchify
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 font-semibold flex gap-4">
            <li>
              <DashboardButton />
            </li>
            <li>
              <ConnexionButton />
            </li>
            {/*<li>
            <details>
              <summary>Parent</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>*/}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
