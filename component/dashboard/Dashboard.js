"use client";
import { useEffect, useState } from "react";
import TeamManager from "./TeamManager";
import Sidebar from "./Sidebar";
import TeamForm from "./TeamForm";
import { getTeams, postTeam } from "@/utils/api";
import ScheduleForm from "./ScheduleForm";
import { generateSchedule } from "@/utils/generateSchedule";
import { exportSchedule } from "@/utils/exportSchedule";
import MatchForm from "./matchs/MatchForm";
import { fetchGames } from "@/utils/api";

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
  const [generateScheduleForm, setGenerateSchedule] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState(teamProps);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [schedule, setSchedule] = useState([]);

  // Fetch teams from your API
  useEffect(() => {
    getTeams().then((data) => setTeams(data));
  }, []);

  // Fetch schedule from your API
  useEffect(() => {
    const loadSchedule = async () => {
      const result = await fetchGames();
      setSchedule(Object.values(result)); // ici tu transformes si nécessaire
    };

    loadSchedule();
  }, []);
  const handleAddTeam = async (e) => {
    e.preventDefault();
    await postTeam(newTeam);
    // Refresh teams list
    const updated = await getTeams();
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

  // Handle schedule generation
  const handleGenerateSchedule = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // e.target est le formulaire
    const data = Object.fromEntries(formData.entries());
    const schedule = generateSchedule(teams, data);
    exportSchedule(schedule);
    setGenerateSchedule(false);
  };

  // Handle match entry
  const handleMatchEntry = async (e, data) => {
    e.preventDefault();

    const {
      selectedMatchId,
      scoresA,
      scoresB,
      playersA,
      playersB,
      cardsA = {},
      cardsB = {},
    } = data;

    console.log("Match Entry Data:", data);
    
    // 1. Update the match result and status
    await fetch(`/api/games`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: selectedMatchId,
        scoreA: Object.values(scoresA).reduce(
          (sum, val) => sum + (val || 0),
          0
        ),
        scoreB: Object.values(scoresB).reduce(
          (sum, val) => sum + (val || 0),
          0
        ),
        status: "played",
      }),
    });

    // 2. Update player stats for team A
    await Promise.all(
      playersA.map(async (player) => {
        const goals = scoresA[player._id] || 0;
        const yellowCards = cardsA[player._id]?.yellow || 0;
        const redCards = cardsA[player._id]?.red || 0;

        await fetch(`/api/players`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: player._id,
            goals: (player.goals || 0) + goals,
            yellowCards: (player.yellowCards || 0) + yellowCards,
            redCards: (player.redCards || 0) + redCards,
          }),
        });
      })
    );

    // 3. Update player stats for team B
    await Promise.all(
      playersB.map(async (player) => {
        const goals = scoresB[player._id] || 0;
        const yellowCards = cardsB[player._id]?.yellow || 0;
        const redCards = cardsB[player._id]?.red || 0;
        await fetch(`/api/players`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: player._id,
            goals: (player.goals || 0) + goals,
            yellowCards: (player.yellowCards || 0) + yellowCards,
            redCards: (player.redCards || 0) + redCards,
          }),
        });
      })
    );

    setShowMatchForm(false);
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
        onGenerateSchedule={() => setGenerateSchedule(true)}
        onAddTeam={() => setShowAdd(true)}
        onEnterResult={() => setShowMatchForm(true)}
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
        {generateScheduleForm && (
          <ScheduleForm
            onSubmit={(e) => handleGenerateSchedule(e)}
            onCancel={() => setGenerateSchedule(false)}
            submitLabel="Générer horaire"
          />
        )}
        {showMatchForm && (
          <MatchForm
            onSubmit={(e, data) => handleMatchEntry(e, data)}
            onCancel={() => setShowMatchForm(false)}
            submitLabel="Entrer un match"
            scheduledGames={schedule && schedule.length > 0 ? schedule : []}
            teams={teams}
          />
        )}
        {currentTeam && !showAdd && !generateScheduleForm && !showMatchForm ? (
          <TeamManager team={currentTeam} onTeamDeleted={handleTeamDeleted} />
        ) : null}
        {!currentTeam && !showAdd ? <div>Aucune équipe</div> : null}
      </main>
    </div>
  );
}
