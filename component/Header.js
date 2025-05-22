function Header() {
  return (
    <div className="fixed navbar bg-base-100 shadow-sm justify-center">
      <div className="flex w-8/10 h-full items-center">
        <div className="flex-1">
          <a className="text-2xl font-semibold hover:opacity-90">Matchify</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 font-semibold">
            <li>
              <a>Connexion</a>
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
