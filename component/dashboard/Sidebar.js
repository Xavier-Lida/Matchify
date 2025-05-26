"use client";

// Sidebar design: displays a vertical list of teams (no logic, just UI)
// Props: teams (array), selectedTeamId (string), onSelect (function, not used here)

export default function Sidebar({ teams = [], selectedTeamId, onSelect }) {
  return (
    <aside className="fixed w-52 bg-base-200 h-full p-4 pt-6 border-r border-base-300">
      <h2 className="text-xl font-bold mb-4">Équipes</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li
            key={team._id}
            className={`p-3 rounded cursor-pointer transition-colors ${
              selectedTeamId === team._id
                ? "bg-primary text-white font-semibold"
                : "hover:bg-base-300"
            }`}
            onClick={() => onSelect(team._id)}
          >
            <div className="flex items-center gap-3">
              {/* {team.logo && (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              )} */}
              <span>{team.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
