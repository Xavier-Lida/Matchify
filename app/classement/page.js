"use client";

import { useEffect, useState } from "react";
import LeaderboardContainer from "@/component/leaderboard/LeaderboardContainer";

const initialTeamFilters = [
  {
    name: "trimester",
    value: "1",
    options: [
      { value: "1", label: "Trimestre 1" },
      { value: "2", label: "Trimestre 2" },
      { value: "3", label: "Trimestre 3" },
    ],
  },
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
  const [games, setGames] = useState([]);
  const [scorers, setScorers] = useState([]);

  // Load teams, games, and set up divisions
  useEffect(() => {
    Promise.all([
      fetch("/api/teams").then((res) => res.json()),
      fetch("/api/games").then((res) => res.json()),
    ]).then(([teamsData, gamesData]) => {
      const divisions = Array.from(
        new Set(teamsData.map((team) => team.division))
      ).filter(Boolean);

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
              }
            : filter
        )
      );

      setTeams(teamsData);
      setGames(gamesData);
    });
  }, []);

  // Load scorers when teams are loaded
  useEffect(() => {
    if (teams.length > 0) {
      loadScorers(scorerFilters);
    }
  }, [teams]);

  const loadScorers = (filters) => {
    const division = filters.find((f) => f.name === "division")?.value;

    fetch("/api/players/scorers")
      .then((res) => res.json())
      .then((players) => {
        const teamMap = Object.fromEntries(teams.map((t) => [t._id, t]));
        
        const filtered = players
          .filter((p) => {
            const team = teamMap[p.teamId];
            if (!team) return false;
            if (division && team.division !== division) return false;
            return true;
          })
          .sort((a, b) => b.goals - a.goals)
          .map((player, idx) => ({
            ranking: idx + 1,
            name: player.firstName + " " + player.lastName,
            team: teamMap[player.teamId]?.name || "-",
            gamesPlayed: "-",
            goals: player.goals,
            assists: player.assists ?? "-",
            points: player.goals ?? "-",
          }));
        setScorers(filtered);
      });
  };

  // Calculate team standings based on completed games in the selected trimester
  const calculateStandings = () => {
    const trimester = teamFilters.find((f) => f.name === "trimester")?.value;
    const division = teamFilters.find((f) => f.name === "division")?.value;

    // Filter games by trimester and completed status
    const relevantGames = games.filter(
      (game) => game.trimester === trimester && game.status === "played"
    );

    // Initialize stats for each team
    const teamStats = {};
    teams.forEach((team) => {
      if (!division || team.division === division) {
        teamStats[team._id] = {
          name: team.name,
          division: team.division,
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }
    });

    // Calculate stats from games
    relevantGames.forEach((game) => {
      const { teamA, teamB, scoreA, scoreB } = game;

      if (teamStats[teamA]) {
        teamStats[teamA].gamesPlayed++;
        teamStats[teamA].goalsFor += scoreA || 0;
        teamStats[teamA].goalsAgainst += scoreB || 0;

        if (scoreA > scoreB) {
          teamStats[teamA].wins++;
          teamStats[teamA].points += 3;
        } else if (scoreA === scoreB) {
          teamStats[teamA].draws++;
          teamStats[teamA].points += 1;
        } else {
          teamStats[teamA].losses++;
        }
      }

      if (teamStats[teamB]) {
        teamStats[teamB].gamesPlayed++;
        teamStats[teamB].goalsFor += scoreB || 0;
        teamStats[teamB].goalsAgainst += scoreA || 0;

        if (scoreB > scoreA) {
          teamStats[teamB].wins++;
          teamStats[teamB].points += 3;
        } else if (scoreB === scoreA) {
          teamStats[teamB].draws++;
          teamStats[teamB].points += 1;
        } else {
          teamStats[teamB].losses++;
        }
      }
    });

    // Calculate goal difference and sort
    return Object.values(teamStats)
      .map((team) => ({
        ...team,
        goalDifference: team.goalsFor - team.goalsAgainst,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goalDifference - a.goalDifference;
      })
      .map((team, idx) => ({
        ...team,
        ranking: idx + 1,
      }));
  };

  const handleTeamFilterChange = (name, value) => {
    setTeamFilters((prev) =>
      prev.map((filter) =>
        filter.name === name ? { ...filter, value } : filter
      )
    );
  };

  const handleScorerFilterChange = (name, value) => {
    const newFilters = scorerFilters.map((filter) =>
      filter.name === name ? { ...filter, value } : filter
    );
    setScorerFilters(newFilters);
    if (teams.length > 0) {
      loadScorers(newFilters);
    }
  };

  const teamColumns = [
    { key: "ranking", label: "#" },
    { key: "name", label: "Équipe", align: "text-left" },
    { key: "gamesPlayed", label: "MJ" },
    { key: "wins", label: "V" },
    { key: "draws", label: "N" },
    { key: "losses", label: "D" },
    { key: "goalsFor", label: "BP" },
    { key: "goalsAgainst", label: "BC" },
    { key: "goalDifference", label: "DB" },
    { key: "points", label: "PTS" },
  ];

  const scorerColumns = [
    { key: "ranking", label: "#" },
    { key: "name", label: "Nom", align: "text-left" },
    { key: "team", label: "Équipe", align: "text-left" },
    { key: "gamesPlayed", label: "MJ" },
    { key: "goals", label: "B" },
    { key: "points", label: "PTS" },
  ];

  const filteredTeams = calculateStandings();

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