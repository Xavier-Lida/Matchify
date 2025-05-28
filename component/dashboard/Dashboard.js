"use client";
import { useEffect, useState } from "react";
import TeamManager from "./TeamManager";
import Sidebar from "./Sidebar";
import TeamForm from "./TeamForm";
import { getTeams, postTeam } from "@/utils/api";

export default function Dashboard() {
  const teamProps = {
    name: "",
    division: "",
    points: 0,
    players: [],
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    logo: "",
  };
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState(teamProps);

  // Fetch teams from your API
  useEffect(() => {
    getTeams().then((data) => setTeams(data));
  }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    await postTeam(newTeam);
    // Refresh teams list
    const updated = await getTeams()
    setTeams(updated);
    setShowAdd(false);
    setNewTeam(teamProps);
    setCurrentIndex(updated.length - 1); // Select the new team
  };

  // Handle team deletion from TeamManager
  const handleTeamDeleted = (deletedId) => {
    const updatedTeams = teams.filter((t) => t._id !== deletedId);
    setTeams(updatedTeams);
    // Adjust currentIndex if needed
    if (updatedTeams.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= updatedTeams.length) {
      setCurrentIndex(updatedTeams.length - 1);
    }
  };

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
        onAddTeam={() => setShowAdd(true)}
      />
      <main className="flex-1 flex flex-col items-center justify-center">
        {showAdd && (
          <TeamForm
            form={newTeam}
            onChange={(e) =>
              setNewTeam({ ...newTeam, [e.target.name]: e.target.value })
            }
            onSubmit={handleAddTeam}
            onCancel={() => setShowAdd(false)}
            submitLabel="Créer"
          />
        )}
        {currentTeam && !showAdd ? (
          <TeamManager team={currentTeam} onTeamDeleted={handleTeamDeleted} />
        ) : null}
        {!currentTeam && !showAdd ? <div>Aucune équipe</div> : null}
      </main>
    </div>
  );
}
