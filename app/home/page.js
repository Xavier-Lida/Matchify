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
  const [scorers, setScorers] = useState([]); // À remplir plus tard

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        const divisions = Array.from(new Set(data.map((team) => team.division))).filter(Boolean);
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
        setTeams(data);
      });
  }, []);

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

  const handleTeamFilterChange = (name, value) => {
    setTeamFilters((prev) =>
      prev.map((filter) =>
        filter.name === name ? { ...filter, value } : filter
      )
    );
  };

  const handleScorerFilterChange = (name, value) => {
    setScorerFilters((prev) =>
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
    <main className="pt-20 px-4 w-full min-h-screen flex flex-col items-center justify-start">
      <LeaderboardContainer
        title="Classement des équipes"
        subtitle="Saison en cours"
        filters={teamFilters}
        onFilterChange={handleTeamFilterChange}
        columns={teamColumns}
        data={filteredTeams}
      />
      <LeaderboardContainer
        title="Stats des buteurs"
        subtitle="Saison en cours"
        filters={scorerFilters}
        onFilterChange={handleScorerFilterChange}
        columns={scorerColumns}
        data={scorers}
      />
    </main>
  );
}
