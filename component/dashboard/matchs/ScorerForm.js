export default function ScorerForm({ players = [], onChange, scores = {}, cards = {}, onCardChange }) {
  return (
    <div className="flex flex-col gap-2">
      {players?.map((player) => (
        <div key={player._id} className="flex items-center gap-2">
          <span>
            {player.firstName} {player.lastName}
          </span>
          <input
            type="number"
            min={0}
            name={`goals-${player._id}`}
            className="input input-sm input-bordered w-16"
            value={scores[player._id] || 0}
            onChange={onChange}
          />
          <select
            name={`card-${player._id}`}
            className="select select-sm select-bordered w-24"
            value={cards[player._id] || "none"}
            onChange={onCardChange}
          >
            <option value="none">Aucun</option>
            <option value="yellow">Jaune</option>
            <option value="red">Rouge</option>
          </select>
        </div>
      ))}
    </div>
  );
}
