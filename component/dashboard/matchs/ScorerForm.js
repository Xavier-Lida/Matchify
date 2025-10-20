export default function ScorerForm({
  players = [],
  onChange,
  scores = {},
  cards = {},
  onCardChange,
  playedGames = {}, // Add this prop
  onPlayedGameChange, // Add this prop
}) {
  return (
    <div className="flex flex-col gap-1">
      {players?.map((player) => (
        <div
          key={player._id}
          className="grid grid-cols-[2fr_0.7fr_1.2fr_0.8fr] items-center gap-1" // Add 4th column
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
            <option value="yellow/red">Jaune/Rouge</option>
            <option value="red">Rouge</option>
          </select>
          <div className="flex justify-center">
            <input
              type="checkbox"
              name={`played-${player._id}`}
              className="checkbox checkbox-sm"
              checked={playedGames[player._id] || false}
              onChange={onPlayedGameChange}
              title="A joué"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
