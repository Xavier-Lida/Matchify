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
import SuccessMessage from "./SuccessMessage";
import { refreshResults } from "@/utils/refreshResults";
import { refreshScorers } from "@/utils/refreshScorers";
import { calculateSuspensions } from "@/utils/calculateSusupensions";

export default function Dashboard() {
  const teamProps = {
    name: "",
    division: "",
    points: 0,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    logo: "",
    coachEmail: "",
  };
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newTeam, setNewTeam] = useState(teamProps);
  const [schedule, setSchedule] = useState([]);
  const [activeMenu, setActiveMenu] = useState(""); // "", "add", "schedule", "match"
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch teams from your API
  useEffect(() => {
    getTeams().then((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      setTeams(data);
    });
  }, []);

  // Fetch schedule from your API
  useEffect(() => {
    const loadSchedule = async () => {
      const result = await fetchGames();
      setSchedule(Object.values(result)); // ici tu transformes si nécessaire
    };

    loadSchedule();
  }, []);
  // Handle team addition
  const handleAddTeam = async (e) => {
    e.preventDefault();
    await postTeam(newTeam);
    const updated = await getTeams();
    updated.sort((a, b) => a.name.localeCompare(b.name));
    setTeams(updated);
    setSuccessMessage("Équipe ajoutée avec succès !");
    setTimeout(() => setSuccessMessage(""), 2000);
    setNewTeam(teamProps);
    setCurrentIndex(updated.length - 1);
    setActiveMenu("");
  };

  // Handle team deletion from TeamManager
  const handleTeamDeleted = (deletedId) => {
    const updatedTeams = teams.filter((t) => t._id !== deletedId);
    setTeams(updatedTeams);
    setSuccessMessage("Équipe supprimée avec succès !");
    setTimeout(() => setSuccessMessage(""), 2000);
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
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const schedule = generateSchedule(teams, data);
    exportSchedule(schedule);
    setSuccessMessage("Horaire généré !");
    setTimeout(() => setSuccessMessage(""), 2000);
    setActiveMenu("");
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
      goals = [],
      cards,
    } = data;

    // 1. POST each card to the cards API and collect their IDs
    await Promise.all(
      (cards || []).map(async (card) => {
        await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card),
        });
      })
    );

    // 2. Update the match result, WITHOUT referencing card IDs
    const updatedGame = {
      _id: selectedMatchId,
      scoreA: Object.values(scoresA).reduce((sum, val) => sum + (val || 0), 0),
      scoreB: Object.values(scoresB).reduce((sum, val) => sum + (val || 0), 0),
      status: "played",
      goals,
    };

    await fetch(`/api/games`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGame),
    });

    const suspensionsRes = await fetch("/api/suspensions");
    const currentSuspensions = await suspensionsRes.json();

    const newSuspensions = calculateSuspensions(
      [...playersA, ...playersB],
      cards,
      currentSuspensions,
      selectedMatchId
    );

    await Promise.all(
      newSuspensions.map((suspension) =>
        fetch("/api/suspensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(suspension),
        })
      )
    );

    await refreshResults({
      selectedMatchId,
      goals,
      cards,
      setTeams,
      setSchedule,
    });
    await refreshScorers();

    setSuccessMessage("Match modifié avec succès !");
    setTimeout(() => setSuccessMessage(""), 2000);
    setActiveMenu("");
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
      <SuccessMessage message={successMessage} />
      <Sidebar
        teams={teams}
        selectedTeamId={currentTeam?._id}
        onSelect={(teamId) => {
          const idx = teams.findIndex((t) => t._id === teamId);
          if (idx !== -1) setCurrentIndex(idx);
        }}
        onGenerateSchedule={() => setActiveMenu("schedule")}
        onAddTeam={() => setActiveMenu("add")}
        onEnterResult={() => setActiveMenu("match")}
      />
      <main className="flex-1 flex flex-col items-center justify-center">
        {activeMenu === "add" && (
          <TeamForm
            form={newTeam}
            onChange={(e) =>
              setNewTeam({ ...newTeam, [e.target.name]: e.target.value })
            }
            onSubmit={handleAddTeam}
            onCancel={() => setActiveMenu("")}
            submitLabel="Créer"
          />
        )}
        {activeMenu === "schedule" && (
          <ScheduleForm
            onSubmitAuto={handleGenerateSchedule}
            setSchedule={setSchedule}
            onCancel={() => setActiveMenu("")}
            submitLabel="Gérer l'horaire"
          />
        )}
        {activeMenu === "match" && (
          <MatchForm
            teams={teams}
            onSubmit={handleMatchEntry}
            onCancel={() => setActiveMenu("")}
            submitLabel="Entrer un match"
            scheduledGames={schedule && schedule.length > 0 ? schedule : []}
          />
        )}
        {currentTeam && activeMenu === "" ? (
          <TeamManager team={currentTeam} onTeamDeleted={handleTeamDeleted} />
        ) : null}
        {!currentTeam && activeMenu === "" ? <div>Aucune équipe</div> : null}
      </main>
    </div>
  );
}
