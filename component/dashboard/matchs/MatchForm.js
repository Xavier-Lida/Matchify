import { useState, useEffect } from "react";
import ScorerForm from "./ScorerForm";

export default function MatchForm({
  onSubmit,
  onCancel,
  submitLabel = "",
  scheduledGames,
  teams = [],
}) {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const selectedMatch = scheduledGames.find((m) => m._id === selectedMatchId);
  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  
  useEffect(() => {
    if (selectedMatch) {
      const matchA_id = selectedMatch.teamA._id;
      setPlayersA(teams.find((team) => team._id === matchA_id).players);
    } else {
      setPlayersA([]);
    }
  }, [selectedMatchId]);

  useEffect(() => {
    if (selectedMatch) {
      const matchB_id = selectedMatch.teamB._id;
      setPlayersB(teams.find((team) => team._id === matchB_id).players);
    } else {
      setPlayersB([]);
    }
  }, [selectedMatchId]);

  console.log(selectedMatch);
  return (
    <form
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      {/* Sélection du match */}
      <div>
        <label className="block mb-1 font-medium">Match</label>
        <select
          name="matchId"
          className="select select-bordered w-full"
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          required
        >
          <option value="">Sélectionner un match</option>
          {scheduledGames.map((match) => (
            <option key={match._id} value={match._id}>
              {match.date} — {match.teamA.name} vs {match.teamB.name}
            </option>
          ))}
        </select>
      </div>

      {/* Score final */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-1 font-medium">
            Score {selectedMatch?.teamA.name}
          </label>
          <input
            type="number"
            name="scoreA"
            min={0}
            className="input input-bordered w-full"
            required
          />
        </div>
        <span className="text-xl font-bold">-</span>
        <div className="flex-1">
          <label className="block mb-1 font-medium">
            Score {selectedMatch?.teamB.name}
          </label>
          <input
            type="number"
            name="scoreB"
            min={0}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      {/* Buteurs */}
      <div>
        <label className="block mb-1 font-medium">Buteurs</label>
        <div className="flex justify-between">
          <ScorerForm players={playersA} />
          <ScorerForm players={playersB} />
        </div>
      </div>

      {/* Cartons */}
      {/* <div>
        <label className="block mb-1 font-medium">Cartons</label>
        {players?.map((player) => (
          <div key={player._id} className="flex items-center gap-2 mb-2">
            <select
              name={`cards-${player._id}`}
              className="select select-sm select-bordered w-32"
            >
              <option value="">Aucun</option>
              <option value="yellow">🟨 Jaune</option>
              <option value="red">🟥 Rouge</option>
            </select>
            <span>
              {player.name} ({player.name})
            </span>
          </div>
        ))}
      </div> */}

      <div className="flex gap-2 mt-4">
        <button className="btn btn-success" type="submit">
          {submitLabel}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
