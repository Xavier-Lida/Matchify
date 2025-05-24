"use client";

import { useEffect, useState } from "react";
import InfoTable from "@/component/InfoTable";

export default function HomePage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        // Sort by points descending and add ranking
        const sorted = [...data]
          .sort((a, b) => b.points - a.points)
          .map((team, idx) => ({
            ranking: idx + 1,
            name: team.name,
            division: team.division,
            points: team.points,
          }));
        setTeams(sorted);
      });
  }, []);

  return (
    <main className="pt-20 px-4 w-full min-h-screen flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl">
        <InfoTable name="Équipes" info={teams} />
      </div>
    </main>
  );
}
