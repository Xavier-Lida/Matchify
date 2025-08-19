export default function CoachCard({ team, print }) {
  return (
    <div className="card bg-gray-50 shadow-md px-8 py-4 flex flex-col w-full max-w-3xl">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold">{team.name}</h3>
            <div className="text-sm text-gray-500">
              Division: {team.division}
            </div>
            <div className="text-sm text-gray-500">Points: {team.points}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-warning btn-sm"
            onClick={print}
          >
            Feuilles de match
          </button>
        </div>
      </div>
    </div>
  );
}
