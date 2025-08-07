import { useEffect, useState } from "react";
import { getPlayersByTeamId, getCardsByMatchId } from "@/utils/api";
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
  const [scoresA, setScoresA] = useState({});
  const [scoresB, setScoresB] = useState({});
  const [cardsA, setCardsA] = useState({});
  const [cardsB, setCardsB] = useState({});

  // Load players and prefill scores/cards when match changes
  useEffect(() => {
    if (!selectedMatch) {
      setPlayersA([]);
      setPlayersB([]);
      setScoresA({});
      setScoresB({});
      setCardsA({});
      setCardsB({});
      return;
    }

    // Fetch players for both teams
    Promise.all([
      getPlayersByTeamId(selectedMatch.teamA),
      getPlayersByTeamId(selectedMatch.teamB),
    ]).then(([playersAData, playersBData]) => {
      setPlayersA(playersAData);
      setPlayersB(playersBData);
    });
    // Prefill scores if match is played
    if (
      selectedMatch.status === "played" &&
      Array.isArray(selectedMatch.goals)
    ) {
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

    // Prefill cards if match is played and has cards array
    if (selectedMatch._id) {
      getCardsByMatchId(selectedMatch._id).then((cards) => {
        const cardsAInit = {};
        const cardsBInit = {};
        cards.forEach((c) => {
          if (c.teamId === selectedMatch.teamA) {
            cardsAInit[c.playerId] = c.type;
          } else if (c.teamId === selectedMatch.teamB) {
            cardsBInit[c.playerId] = c.type;
          }
        });
        setCardsA(cardsAInit);
        setCardsB(cardsBInit);
      });
    } else {
      setCardsA({});
      setCardsB({});
    }
  }, [selectedMatchId, selectedMatch]);

  // Handlers for input changes
  const handleChangeA = (e) => {
    const { name, value } = e.target;
    const playerId = name.split("-")[1];
    setScoresA((prev) => ({
      ...prev,
      [playerId]: parseInt(value) || 0,
    }));
  };

  const handleChangeB = (e) => {
    const { name, value } = e.target;
    const playerId = name.split("-")[1];
    setScoresB((prev) => ({
      ...prev,
      [playerId]: parseInt(value) || 0,
    }));
  };

  const handleCardChangeA = (e) => {
    const { name, value } = e.target;
    const playerId = name.split("-")[1];
    setCardsA((prev) => ({
      ...prev,
      [playerId]: value,
    }));
  };

  const handleCardChangeB = (e) => {
    const { name, value } = e.target;
    const playerId = name.split("-")[1];
    setCardsB((prev) => ({
      ...prev,
      [playerId]: value,
    }));
  };

  // Derived values
  const valueA = Object.values(scoresA).reduce((sum, val) => sum + val, 0);
  const valueB = Object.values(scoresB).reduce((sum, val) => sum + val, 0);

  // Prepare goals and cards for submission
  const scorersA = Object.entries(scoresA)
    .filter(([_, count]) => count > 0)
    .flatMap(([playerId, count]) =>
      Array.from({ length: count }, () => ({
        playerId,
        teamId: selectedMatch?.teamA,
      }))
    );
  const scorersB = Object.entries(scoresB)
    .filter(([_, count]) => count > 0)
    .flatMap(([playerId, count]) =>
      Array.from({ length: count }, () => ({
        playerId,
        teamId: selectedMatch?.teamB,
      }))
    );
  const goals = [...scorersA, ...scorersB];
  const cards = [
    ...Object.entries(cardsA)
      .filter(([_, type]) => type !== "none")
      .map(([playerId, type]) => ({
        playerId,
        type,
        matchId: selectedMatch?._id,
        used: false,
      })),
    ...Object.entries(cardsB)
      .filter(([_, type]) => type !== "none")
      .map(([playerId, type]) => ({
        playerId,
        type,
        matchId: selectedMatch?._id,
        used: false,
      })),
  ];

  // Sort games chronologically
  const sortedGames = [...scheduledGames].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <form
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e, {
          selectedMatchId,
          scoresA,
          scoresB,
          playersA,
          playersB,
          goals,
          cards,
        });
      }}
    >
      {/* Match selection */}
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
              {match.date} —{" "}
              {teams.find((t) => t._id === match.teamA)?.name || "Équipe A"} vs{" "}
              {teams.find((t) => t._id === match.teamB)?.name || "Équipe B"}
              {match.status === "played" ? " (Terminé)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Score final */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-1 font-medium">
            Score{" "}
            {selectedMatch?.teamA &&
              teams.find((t) => t._id === selectedMatch.teamA)?.name}
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
            Score{" "}
            {selectedMatch?.teamB &&
              teams.find((t) => t._id === selectedMatch.teamB)?.name}
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

      {/* Scorers and cards */}
      <div>
        <label className="block mb-1 font-medium">Buteurs et cartons</label>
        <div className="flex gap-8">
          <ScorerForm
            players={playersA}
            onChange={handleChangeA}
            scores={scoresA}
            cards={cardsA}
            onCardChange={handleCardChangeA}
          />
          <ScorerForm
            players={playersB}
            onChange={handleChangeB}
            scores={scoresB}
            cards={cardsB}
            onCardChange={handleCardChangeB}
          />
        </div>
      </div>

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
