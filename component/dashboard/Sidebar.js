function Sidebar() {
  // Adjust this value to match your header's height (e.g., 64px)
  const headerHeight = "64px";

  return (
    <aside
      className="fixed left-0 w-64 bg-base-200 border-r border-base-300 p-6 flex flex-col z-50"
      style={{ top: headerHeight, height: `calc(100vh - ${headerHeight})` }}
    >
      <h2 className="text-lg font-semibold mb-6">Modifier informations</h2>
      <nav className="flex flex-col gap-2 flex-1">
        <button className="btn btn-primary w-full mb-2">Équipe</button>
        <button className="btn btn-primary w-full mb-2">Joueur</button>
        <button className="btn btn-primary w-full mb-2">Match</button>
        <button className="btn btn-primary w-full mb-4">But</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
