export default function ScorerForm({
  players = [],
  onChange,
  scores = {},
  cards = {},
  onCardChange,
}) {
  return (
    <div className="flex flex-col gap-1">
      {players?.map((player) => (
        <div
          key={player._id}
          className="grid grid-cols-[2fr_0.7fr_1.2fr] items-center gap-1"
        >
          <span className="truncate font-medium">
            {player.firstName} {player.lastName}
          </span>
          <input
            type="number"
            min={0}
            name={`goals-${player._id}`}
            className="input input-sm input-bordered w-full"
            value={scores[player._id] || 0}
            onChange={onChange}
          />
          <select
            name={`card-${player._id}`}
            className="select select-sm select-bordered w-full"
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
