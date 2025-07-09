"use client";
import React, { useEffect, useState } from "react";
import { fetchGames, getTeams } from "@/utils/api";

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  // "7 sept. 2025"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchGames().then(setSchedule);
    getTeams().then(setTeams);
  }, []);

  const getTeam = (id) => teams.find((t) => t._id === id);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Calendrier des matchs</h2>
      <ul className="space-y-4">
        {schedule.map((match, index) => {
          const teamA = getTeam(match.teamA);
          const teamB = getTeam(match.teamB);
          return (
            <li
              key={index}
              className="bg-white shadow rounded-lg border border-gray-200 px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-8"
            >
              {/* Date & status */}
              <div className="flex flex-col items-start min-w-[140px] md:border-r md:pr-6">
                <div className="text-xs text-gray-500 font-medium">
                  {formatDateFR(match.date)} {match.time && `• ${match.time}`}
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
                  <div className="flex flex-col items-end flex-1 min-w-[140px]">
                    <span className="font-semibold text-base md:text-lg break-words">
                      {teamA?.name || "?"}
                    </span>
                  </div>
                  {/* Score */}
                  <div className="flex flex-col items-center mx-2 min-w-[60px]">
                    {match.status === "played" ? (
                      <span className="text-xl font-bold">
                        {match.scoreA} <span className="text-gray-400">-</span>{" "}
                        {match.scoreB}
                      </span>
                    ) : (
                      <span className="text-lg text-gray-400">vs</span>
                    )}
                  </div>
                  {/* Team B */}
                  <div className="flex flex-col items-start flex-1 min-w-[140px]">
                    <span className="font-semibold text-base md:text-lg break-words">
                      {teamB?.name || "?"}
                    </span>
                  </div>
                </div>
                {/* League & location */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
