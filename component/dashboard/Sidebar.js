"use client";

// Sidebar design: displays a vertical list of teams (no logic, just UI)
// Props: teams (array), selectedTeamId (string), onSelect (function), onAddTeam (function)

export default function Sidebar({
  teams = [],
  selectedTeamId,
  onSelect,
  onAddTeam,
}) {
  return (
    <aside
      className="fixed flex flex-col w-52 bg-base-200 max-h-[calc(100vh-5rem)] h-[calc(100vh-5rem)] p-4 pt-6 border-r border-base-300"
      style={{ top: "4rem", left: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Équipes</h2>
      <ul className="space-y-1 flex-1 min-h-0 overflow-y-auto">
        {teams.map((team) => (
          <li
            key={team._id}
            className={`p-2 rounded cursor-pointer transition-colors ${
              selectedTeamId === team._id
                ? "bg-primary text-white font-semibold"
                : "hover:bg-base-300"
            }`}
            onClick={() => onSelect(team._id)}
          >
            <div className="flex items-center gap-3">
              <span>{team.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-primary mt-4"
        style={{ marginTop: "auto" }}
        onClick={onAddTeam}
      >
        Ajouter une équipe
      </button>
    </aside>
  );
}
