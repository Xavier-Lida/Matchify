"use client";

import { useEffect, useState } from "react";
import LeaderboardContainer from "@/component/leaderboard/LeaderboardContainer";

const initialTeamFilters = [
  {
    name: "division",
    value: "",
    options: [{ value: "", label: "Toutes les divisions" }],
  },
];

const initialScorerFilters = [
  {
    name: "division",
    value: "",
    options: [{ value: "", label: "Toutes les divisions" }],
  },
];

export default function HomePage() {
  const [teamFilters, setTeamFilters] = useState(initialTeamFilters);
  const [scorerFilters, setScorerFilters] = useState(initialScorerFilters);
  const [teams, setTeams] = useState([]);
  const [scorers, setScorers] = useState([]);

  // Charger équipes et buteurs
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((teamsData) => {
        const divisions = Array.from(new Set(teamsData.map((team) => team.division))).filter(Boolean);
        setTeamFilters((prev) =>
          prev.map((filter) =>
            filter.name === "division"
              ? {
                  ...filter,
                  options: [
                    { value: "", label: "Toutes les divisions" },
                    ...divisions.map((d) => ({
                      value: d,
                      label: `Division ${d}`,
                    })),
                  ],
                  value: filter.value || "",
                }
              : filter
          )
        );
        setScorerFilters((prev) =>
          prev.map((filter) =>
            filter.name === "division"
              ? {
                  ...filter,
                  options: [
                    { value: "", label: "Toutes les divisions" },
                    ...divisions.map((d) => ({
                      value: d,
                      label: `Division ${d}`,
                    })),
                  ],
                  value: filter.value || "",
                }
              : filter
          )
        );
        setTeams(teamsData);

        // Charger les buteurs après avoir les équipes (pour le mapping)
        fetch("/api/players/scorers")
          .then((res) => res.json())
          .then((players) => {
            const teamMap = Object.fromEntries(teamsData.map((t) => [t._id, t.name]));
            const filtered = players
              .filter((p) =>
                !scorerFilters[0].value
                  ? true
                  : teamsData.find(
                      (t) =>
                        t._id === p.teamId &&
                        t.division === scorerFilters[0].value
                    )
              )
              .sort((a, b) => b.goals - a.goals)
              .map((player, idx) => ({
                ranking: idx + 1,
                name: player.name,
                team: teamMap[player.teamId] || "-",
                gamesPlayed: player.gamesPlayed ?? "-",
                goals: player.goals,
                assists: player.assists ?? "-",
                points: player.points ?? "-",
              }));
            setScorers(filtered);
          });
      });
  }, []);

  // Filtrage dynamique des équipes
  const filteredTeams = teams
    .filter((team) =>
      !teamFilters[0].value ? true : team.division === teamFilters[0].value
    )
    .sort((a, b) => b.points - a.points)
    .map((team, idx) => ({
      ranking: idx + 1,
      name: team.name,
      division: team.division,
      gamesPlayed: team.gamesPlayed ?? "-",
      wins: team.wins ?? "-",
      draws: team.draws ?? "-",
      losses: team.losses ?? "-",
      points: team.points,
    }));

  // Filtrage dynamique des buteurs
  const handleScorerFilterChange = (name, value) => {
    setScorerFilters((prev) =>
      prev.map((filter) =>
        filter.name === name ? { ...filter, value } : filter
      )
    );
    fetch("/api/players/scorers")
      .then((res) => res.json())
      .then((players) => {
        const teamMap = Object.fromEntries(teams.map((t) => [t._id, t.name]));
        const filtered = players
          .filter((p) =>
            !value
              ? true
              : teams.find(
                  (t) => t._id === p.teamId && t.division === value
                )
          )
          .sort((a, b) => b.goals - a.goals)
          .map((player, idx) => ({
            ranking: idx + 1,
            name: player.name,
            team: teamMap[player.teamId] || "-",
            gamesPlayed: player.gamesPlayed ?? "-",
            goals: player.goals,
            assists: player.assists ?? "-",
            points: player.points ?? "-",
          }));
        setScorers(filtered);
      });
  };

  const handleTeamFilterChange = (name, value) => {
    setTeamFilters((prev) =>
      prev.map((filter) =>
        filter.name === name ? { ...filter, value } : filter
      )
    );
  };

  const teamColumns = [
    { key: "ranking", label: "#" },
    { key: "name", label: "Équipe", align: "text-left" },
    { key: "gamesPlayed", label: "MJ" },
    { key: "wins", label: "V" },
    { key: "draws", label: "N" },
    { key: "losses", label: "D" },
    { key: "points", label: "PTS" },
  ];

  const scorerColumns = [
    { key: "ranking", label: "#" },
    { key: "name", label: "Nom", align: "text-left" },
    { key: "team", label: "Équipe", align: "text-left" },
    { key: "gamesPlayed", label: "MJ" },
    { key: "goals", label: "B" },
    { key: "assists", label: "A" },
    { key: "points", label: "PTS" },
  ];

  return (
    <main className="pt-20 px-4 mb-15 w-full min-h-screen flex flex-col items-center justify-start">
      <LeaderboardContainer
        title="Classement des équipes"
        subtitle="Saison en cours"
        filters={teamFilters}
        onFilterChange={handleTeamFilterChange}
        columns={teamColumns}
        data={filteredTeams}
      />
      <LeaderboardContainer
        title="Classement des buteurs"
        subtitle="Saison en cours"
        filters={scorerFilters}
        onFilterChange={handleScorerFilterChange}
        columns={scorerColumns}
        data={scorers}
      />
    </main>
  );
}
