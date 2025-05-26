export default function TeamCard({ team, onEdit, onDelete }) {
  return (
    <div className="card bg-gray-50 shadow-md p-4 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        {/* <img
          src={team.logo}
          alt={team.name}
          className="w-12 h-12 rounded-full object-cover border"
        /> */}
        <div>
          <h3 className="text-xl font-semibold">{team.name}</h3>
          <div className="text-sm text-gray-500">Division: {team.division}</div>
          <div className="text-sm text-gray-500">Points: {team.points}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => onEdit(team)}
        >
          Modifier
        </button>
        <button
          className="btn btn-sm btn-error"
          onClick={() => onDelete(team.id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}