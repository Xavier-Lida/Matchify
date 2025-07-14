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
import {
  calculateGoalsFor,
  calculateGoalsForPlayer,
  calculateTeamStats,
} from "@/utils/calculateGames";

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
  };
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generateScheduleForm, setGenerateSchedule] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState(teamProps);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [activeMenu, setActiveMenu] = useState(""); // "", "add", "schedule", "match"

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
  const handleAddTeam = async (e) => {
    e.preventDefault();
    await postTeam(newTeam);
    // Refresh teams list
    const updated = await getTeams();
    // Sort teams alphabetically by name
    updated.sort((a, b) => a.name.localeCompare(b.name));
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
      goals = [],
      cards,
    } = data;

    // 1. Update the match result
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
        goals,
        cards,
      }),
    });

    // 2. Refetch the updated schedule
    const updatedSchedule = await fetchGames();
    setSchedule(Object.values(updatedSchedule));

    // 3. Now calculate team stats from the updated schedule
    const teamA = teams.find((t) =>
      playersA.length > 0 ? t._id === playersA[0].teamId : false
    );
    const teamB = teams.find((t) =>
      playersB.length > 0 ? t._id === playersB[0].teamId : false
    );

    if (teamA && teamB) {
      const statsA = calculateTeamStats(
        teamA._id,
        Object.values(updatedSchedule)
      );
      const statsB = calculateTeamStats(
        teamB._id,
        Object.values(updatedSchedule)
      );

      let updateA = {
        ...statsA,
        points: statsA.wins * 3 + statsA.draws,
        goalDifference: statsA.goalsFor - statsA.goalsAgainst,
      };
      let updateB = {
        ...statsB,
        points: statsB.wins * 3 + statsB.draws,
        goalDifference: statsB.goalsFor - statsB.goalsAgainst,
      };

      // Update teamA
      await fetch(`/api/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...teamA, ...updateA }),
      });

      // Update teamB
      await fetch(`/api/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...teamB, ...updateB }),
      });
    }

    // 3. Update player stats for players in the match, using the goals array
    const playedTeamIds = [
      ...(teamA ? [teamA._id] : []),
      ...(teamB ? [teamB._id] : []),
    ];

    await Promise.all(
      [...playersA, ...playersB].map(async (player) => {
        if (playedTeamIds.includes(player.teamId)) {
          // Calculate total goals for this player in all played games (including this one)
          const allGames = schedule
            .map((g) =>
              g._id === selectedMatchId
                ? { ...g, goals, status: "played" } // update the current match with new goals
                : g
            )
            .filter((g) => g.status === "played" && g.goals);
          const goalsCount = allGames.reduce(
            (sum, game) =>
              sum +
              (Array.isArray(game.goals)
                ? game.goals.filter((g) => g.playerId === player._id).length
                : 0),
            0
          );
          const yellowCards = allGames.reduce(
            (sum, game) =>
              sum +
              (Array.isArray(game.cards)
                ? game.cards.filter(
                    (c) => c.playerId === player._id && c.type === "yellow"
                  ).length
                : 0),
            0
          );
          const redCards = allGames.reduce(
            (sum, game) =>
              sum +
              (Array.isArray(game.cards)
                ? game.cards.filter(
                    (c) => c.playerId === player._id && c.type === "red"
                  ).length
                : 0),
            0
          );

          await fetch(`/api/players`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: player._id,
              goals: goalsCount, // total goals for this player
              yellowCards, // just the increment (or update as needed)
              redCards, // just the increment (or update as needed)
            }),
          });
        }
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
            onSubmitAuto={(e) => handleGenerateSchedule(e)}
            onCancel={() => setActiveMenu("")}
            submitLabel="Gérer l'horaire"
          />
        )}
        {activeMenu === "match" && (
          <MatchForm
            teams={teams}
            onSubmit={(e, data) => handleMatchEntry(e, data)}
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
