import { useEffect, useState } from "react";
import { getPlayersByTeamId } from "@/utils/api";
import ScorerForm from "./ScorerForm";

export default function MatchForm({
  teams = { teams },
  onSubmit,
  onCancel,
  submitLabel = "",
  scheduledGames,
}) {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const selectedMatch = scheduledGames.find((m) => m._id === selectedMatchId);

  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);

  useEffect(() => {
    if (selectedMatch) {
      getPlayersByTeamId(selectedMatch.teamA).then(setPlayersA);
      getPlayersByTeamId(selectedMatch.teamB).then(setPlayersB);

      if (
        selectedMatch.status === "played" &&
        selectedMatch.goals &&
        Array.isArray(selectedMatch.goals)
      ) {
        // Prefill logic as you have it
        const scoresAInit = {};
        selectedMatch.goals
          .filter((g) => g.teamId === selectedMatch.teamA)
          .forEach((g) => {
            scoresAInit[g.playerId] = (scoresAInit[g.playerId] || 0) + 1;
          });
        const scoresBInit = {};
        selectedMatch.goals
          .filter((g) => g.teamId === selectedMatch.teamB)
          .forEach((g) => {
            scoresBInit[g.playerId] = (scoresBInit[g.playerId] || 0) + 1;
          });
        setScoresA(scoresAInit);
        setScoresB(scoresBInit);
      } else {
        setScoresA({});
        setScoresB({});
      }
    } else {
      setPlayersA([]);
      setPlayersB([]);
      setScoresA({});
      setScoresB({});
    }
  }, [selectedMatchId, selectedMatch]);

  const [scoresA, setScoresA] = useState({});
  const [scoresB, setScoresB] = useState({});

  const handleChangeA = (e) => {
    const { name, value } = e.target;

    // Extraire l'ID du joueur depuis le name, ex: "goals-123"
    const playerId = name.split("-")[1];

    setScoresA((prev) => ({
      ...prev,
      [playerId]: parseInt(value) || 0,
    }));
  };

  const handleChangeB = (e) => {
    const { name, value } = e.target;

    // Extraire l'ID du joueur depuis le name, ex: "goals-123"
    const playerId = name.split("-")[1];

    setScoresB((prev) => ({
      ...prev,
      [playerId]: parseInt(value) || 0,
    }));
  };

  const valueA = Object.values(scoresA).reduce((sum, val) => sum + val, 0);
  const valueB = Object.values(scoresB).reduce((sum, val) => sum + val, 0);

  // For team A
  const scorersA = Object.entries(scoresA)
    .filter(([playerId, count]) => count > 0)
    .flatMap(([playerId, count]) =>
      Array.from({ length: count }, () => ({
        playerId,
        teamId: selectedMatch?.teamA,
      }))
    );

  // For team B
  const scorersB = Object.entries(scoresB)
    .filter(([playerId, count]) => count > 0)
    .flatMap(([playerId, count]) =>
      Array.from({ length: count }, () => ({
        playerId,
        teamId: selectedMatch?.teamB,
      }))
    );

  // Combine for the full goals array
  const goals = [...scorersA, ...scorersB];

  // Sort games chronologically (oldest first)
  const sortedGames = [...scheduledGames].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <form
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-4"
      onSubmit={(e) => {
        // Build scorers array
        const scorersA = Object.entries(scoresA)
          .filter(([playerId, count]) => count > 0)
          .flatMap(([playerId, count]) =>
            Array.from({ length: count }, () => ({
              playerId,
              teamId: selectedMatch?.teamA,
            }))
          );
        const scorersB = Object.entries(scoresB)
          .filter(([playerId, count]) => count > 0)
          .flatMap(([playerId, count]) =>
            Array.from({ length: count }, () => ({
              playerId,
              teamId: selectedMatch?.teamB,
            }))
          );
        const goals = [...scorersA, ...scorersB];

        onSubmit(e, {
          selectedMatchId,
          scoresA,
          scoresB,
          playersA,
          playersB,
          goals,
        });
      }}
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
          {sortedGames.map((match) => (
            <option key={match._id} value={match._id}>
              {match.date} — {teams.find((t) => t._id === match.teamA).name} vs{" "}
              {teams.find((t) => t._id === match.teamB).name}
              {match.status === "played" ? " (Terminé)" : ""}
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
            value={valueA || 0}
            readOnly
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
            value={valueB || 0}
            readOnly
          />
        </div>
      </div>

      {/* Buteurs */}
      <div>
        <label className="block mb-1 font-medium">Buteurs</label>
        <div className="flex justify-between">
          <ScorerForm
            players={playersA}
            onChange={handleChangeA}
            scores={scoresA}
          />
          <ScorerForm
            players={playersB}
            onChange={handleChangeB}
            scores={scoresB}
          />
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
