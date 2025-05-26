export default function TeamCard({ team, onEdit, onDelete, actions }) {
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
          {actions}
          <button
            className="btn btn-sm btn-outline"
            onClick={() => onEdit(team)}
          >
            Modifier
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => onDelete && onDelete(team._id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
