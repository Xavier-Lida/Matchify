"use client";
import { useEffect, useState } from "react";
import TeamManager from "./TeamManager";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch teams from your API or TeamManager (example with fetch)
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data));
  }, []);

  const currentTeam = teams[currentIndex];

  return (
    <div
      className="flex w-full"
      style={{
        minHeight: "calc(100vh - 5rem)",
        marginTop: "64px",
      }}
    >
      <Sidebar
        teams={teams}
        selectedTeamId={currentTeam?._id}
        onSelect={(teamId) => {
          const idx = teams.findIndex((t) => t._id === teamId);
          if (idx !== -1) setCurrentIndex(idx);
        }}
      />
      <main className="flex-1 flex flex-col items-center justify-center">
        {currentTeam ? (
          <TeamManager team={currentTeam} />
        ) : (
          <div>Aucune équipe</div>
        )}
      </main>
    </div>
  );
}
