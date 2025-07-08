"use client";
import React, { useEffect, useState } from "react";
import { fetchGames, getTeams } from "@/utils/api";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchGames().then(setSchedule);
    getTeams().then(setTeams);
  }, []);

  // Helper to get team name by ID
  const getTeamName = (id) =>
    teams.find((t) => t._id === id)?.name || "Équipe inconnue";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Calendrier des matchs</h2>
      <ul className="space-y-4">
        {schedule.map((match, index) => (
          <li
            key={index}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                🕒 Journée {match.day}
              </div>
              <div className="text-sm text-gray-500">
                {match.date} à {match.time}
              </div>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-semibold">
                {getTeamName(match.teamA)}
              </span>
              <span className="text-gray-400">vs</span>
              <span className="text-lg font-semibold">
                {getTeamName(match.teamB)}
              </span>
            </div>
            <div className="text-sm text-gray-600">📍 {match.location}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
