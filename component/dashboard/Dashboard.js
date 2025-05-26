"use client";
import { useEffect, useState } from "react";
import TeamManager from "./TeamManager";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch teams from your API or TeamManager (example with fetch)
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data));
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
  };

  const currentTeam = teams[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button className="btn btn-sm" onClick={handlePrev} disabled={teams.length === 0}>
          ←
        </button>
        {currentTeam ? (
          <TeamManager team={currentTeam} />
        ) : (
          <div>Aucune équipe</div>
        )}
        <button className="btn btn-sm" onClick={handleNext} disabled={teams.length === 0}>
          →
        </button>
      </div>
    </div>
  );
}