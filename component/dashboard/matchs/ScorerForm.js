export default function ScorerForm({ players = [], onChange }) {
  return (
    <div>
      {players?.map((player) => (
        <div key={player._id} className="flex items-center gap-2 mb-2">
          <input
            type="number"
            name={`goals-${player._id}`}
            onChange={onChange}
            // placeholder={`Buts pour ${player.firstName}`}
            min={0}
            defaultValue={0}
            className="input input-sm input-bordered w-12"
          />
          <span>
            {player.firstName} {player.lastName}
          </span>
        </div>
      ))}
    </div>
  );
}
