"use client";
import React, { useEffect, useState } from "react";
import { fetchGames, getTeams } from "@/utils/api";

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterTrimester, setFilterTrimester] = useState("");
  const [filterJour, setFilterJour] = useState("");
  const [filterEquipe, setFilterEquipe] = useState("");

  useEffect(() => {
    fetchGames().then(setSchedule);
    getTeams().then(setTeams);
  }, []);

  // Set default filters to closest upcoming game day and its trimester
  useEffect(() => {
    if (schedule.length > 0) {
      const now = new Date();
      // Find upcoming games
      const upcoming = schedule
        .filter((match) => {
          const matchDate = new Date(`${match.date}T${match.time || "00:00"}`);
          return matchDate >= now;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
          const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
          return dateA - dateB;
        });

      if (upcoming.length > 0) {
        setFilterTrimester(String(upcoming[0].trimester));
        setFilterJour(String(upcoming[0].day));
      } else {
        // If no upcoming games, show latest trimester and day
        const trimesters = schedule
          .map((match) => Number(match.trimester))
          .filter((n) => !isNaN(n));
        const days = schedule
          .map((match) => Number(match.day))
          .filter((n) => !isNaN(n));
        if (trimesters.length > 0) {
          setFilterTrimester(String(Math.max(...trimesters)));
        }
        if (days.length > 0) {
          setFilterJour(String(Math.max(...days)));
        }
      }
    }
  }, [schedule]);

  const getTeam = (id) => teams.find((t) => t._id === id);

  // Sort games chronologically
  const sortedSchedule = [...schedule].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
    const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
    return dateA - dateB;
  });

  // Filter logic
  const filteredSchedule = sortedSchedule.filter((match) => {
    if (filterTrimester && String(match.trimester) !== filterTrimester)
      return false;
    if (filterJour && String(match.day) !== filterJour) return false;
    if (
      filterEquipe &&
      match.teamA !== filterEquipe &&
      match.teamB !== filterEquipe
    )
      return false;
    return true;
  });

  // Group matches by trimester and then by day
  const matchesByTrimester = {};
  filteredSchedule.forEach((match) => {
    const trimester = String(match.trimester);
    if (!matchesByTrimester[trimester]) matchesByTrimester[trimester] = {};
    if (!matchesByTrimester[trimester][match.day])
      matchesByTrimester[trimester][match.day] = [];
    matchesByTrimester[trimester][match.day].push(match);
  });

  // Get all unique days from the full schedule
  const allDays = Array.from(
    new Set(sortedSchedule.map((match) => String(match.day)))
  ).sort((a, b) => a - b);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Calendrier des matchs</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="filter-trimestre"
          >
            Trimestre
          </label>
          <select
            id="filter-trimestre"
            className="select select-bordered w-full bg-gray-50"
            value={filterTrimester}
            onChange={(e) => setFilterTrimester(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="1">Trimestre 1</option>
            <option value="2">Trimestre 2</option>
            <option value="3">Trimestre 3</option>
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="filter-jour"
          >
            Jour
          </label>
          <select
            id="filter-jour"
            className="select select-bordered w-full bg-gray-50"
            value={filterJour}
            onChange={(e) => setFilterJour(e.target.value)}
          >
            <option value="">Tous</option>
            {allDays.map((day) => (
              <option key={day} value={day}>
                Jour {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="filter-equipe"
          >
            Équipe
          </label>
          <select
            id="filter-equipe"
            className="select select-bordered w-full bg-gray-50"
            value={filterEquipe}
            onChange={(e) => setFilterEquipe(e.target.value)}
          >
            <option value="">Toutes</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Schedule grouped by trimester */}
      {Object.keys(matchesByTrimester)
        .sort((a, b) => a - b)
        .map((trimester) => (
          <div key={trimester} className="mb-12">
            {/* Only show the header if no trimester filter is applied */}
            {!filterTrimester && (
              <h2 className="text-3xl font-bold mb-6">Trimestre {trimester}</h2>
            )}
            {Object.keys(matchesByTrimester[trimester])
              .sort((a, b) => a - b)
              .map((day) => (
                <div key={day} className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Jour {day}</h3>
                  <ul className="space-y-4">
                    {matchesByTrimester[trimester][day].map((match, index) => {
                      const teamA = getTeam(match.teamA);
                      const teamB = getTeam(match.teamB);
                      return (
                        <li
                          key={index}
                          className="bg-white shadow rounded-lg border border-gray-200 px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-8"
                        >
                          {/* Date, location & status */}
                          <div className="flex flex-col items-start min-w-[140px] md:border-r md:pr-6">
                            <div className="text-xs text-gray-500 font-medium">
                              {formatDateFR(match.date)}{" "}
                              {match.time && `• ${match.time}`}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {match.location}
                            </div>
                            <div className="text-xs text-gray-600 font-medium mb-1">
                              {"Division " + (teamA?.division || "")}
                            </div>
                            <div className="text-xs font-bold text-primary uppercase tracking-wide">
                              {match.status === "played" ? "Final" : "À venir"}
                            </div>
                          </div>
                          {/* Teams & score */}
                          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Team A */}
                              <div className="flex flex-col items-end flex-1 min-w-[180px] md:min-w-[220px] truncate">
                                <span className="font-semibold text-base md:text-lg break-words truncate">
                                  {teamA?.name || "?"}
                                </span>
                              </div>
                              {/* Score */}
                              <div className="flex flex-col items-center mx-2 min-w-[60px]">
                                {match.status === "played" ? (
                                  <span className="text-xl font-bold">
                                    {match.scoreA}{" "}
                                    <span className="text-gray-400">-</span>{" "}
                                    {match.scoreB}
                                  </span>
                                ) : (
                                  <span className="text-lg text-gray-400">
                                    vs
                                  </span>
                                )}
                              </div>
                              {/* Team B */}
                              <div className="flex flex-col items-start flex-1 min-w-[180px] md:min-w-[220px] truncate">
                                <span className="font-semibold text-base md:text-lg break-words truncate">
                                  {teamB?.name || "?"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
