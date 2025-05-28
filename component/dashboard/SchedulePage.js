import { useEffect, useState } from "react";
import { generateSchedule } from "@/utils/generateSchedule";

async function getTeams() {
  try {
    const response = await fetch("/api/teams", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const teams = await response.json();
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

export default function SchedulePage() {
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function fetchAndGenerate() {
      try {
        const teamData = await getTeams();
        setTeams(teamData);

        const teamNames = teamData.map((team) => team.name); // ou un autre identifiant
        const generated = generateSchedule(teamNames, true);
        setSchedule(generated);
      } catch (error) {
        console.error("Error generating schedule:", error);
      }
    }

    fetchAndGenerate();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendrier des matchs</h2>
      <ul className="space-y-2">
        {schedule.map((match, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            🕒 Journée {match.day} : <strong>{match.teamA}</strong> vs <strong>{match.teamB}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
