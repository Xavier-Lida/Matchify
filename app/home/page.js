import InfoTable from "@/component/InfoTable";
import { teams } from "@/constants";

export default function HomePage() {
  const sortedTeams = [...teams]
    .sort((a, b) => b.points - a.points)
    .map((team, idx) => ({
      ranking: idx + 1,
      name: team.name,
      division: team.division,
      points: team.points,
    }));

  return (
    <main className="pt-20 px-4 w-full min-h-screen flex flex-col items-center justify-start">
      <div className="w-full max-w-7xl">
        <InfoTable name="Équipes" info={sortedTeams} />
      </div>
    </main>
  );
}
