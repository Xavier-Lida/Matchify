export default function ScorerForm({ players = []}) {
  return (
    <div>
      {players?.map((player) => (
        <div key={player._id} className="flex items-center gap-2 mb-2">
          <input
            type="number"
            name={`goals-${player._id}`}
            placeholder={`Buts pour ${player.firstName}`}
            min={0}
            className="input input-sm input-bordered w-32"
          />
          <span>
            {player.firstName} {player.lastName}
          </span>
        </div>
      ))}
    </div>
  );
}
