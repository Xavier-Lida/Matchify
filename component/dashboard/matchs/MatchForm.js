import { useEffect, useState } from "react";
import { getPlayersByTeamId, getCardsByMatchId } from "@/utils/api";
import { resetMatch } from "@/utils/resetMatch"; // <-- Import your resetMatch function
import ScorerForm from "./ScorerForm";

export default function MatchForm({
  teams,
  onSubmit,
  onCancel,
  submitLabel = "",
  scheduledGames,
  onResetSuccess, // <-- Add prop for reset success handler
}) {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const selectedMatch = scheduledGames.find((m) => m._id === selectedMatchId);

  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  const [scoresA, setScoresA] = useState({});
  const [scoresB, setScoresB] = useState({});
  const [cardsA, setCardsA] = useState({});
  const [cardsB, setCardsB] = useState({});
  const [playedGamesA, setPlayedGamesA] = useState({});
  const [playedGamesB, setPlayedGamesB] = useState({});

  // Load players and prefill scores/cards when match changes
  useEffect(() => {
    if (!selectedMatch) {
      setPlayersA([]);
      setPlayersB([]);
      setScoresA({});
      setScoresB({});
      setCardsA({});
      setCardsB({});
      setPlayedGamesA({});
      setPlayedGamesB({});
      return;
    }

    // Always clear cards state immediately when match changes
    setCardsA({});
    setCardsB({});
    setPlayedGamesA({});
    setPlayedGamesB({});

    // Fetch players for both teams, then fetch cards and assign to teams
    Promise.all([
      getPlayersByTeamId(selectedMatch.teamA),
      getPlayersByTeamId(selectedMatch.teamB),
    ]).then(([playersAData, playersBData]) => {
      setPlayersA(playersAData);
      setPlayersB(playersBData);

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

      // Now fetch cards and assign to the correct team
      if (selectedMatch._id) {
        getCardsByMatchId(selectedMatch._id).then((cards) => {
          const cardsAInit = {};
          const cardsBInit = {};
          const playersAIds = new Set(playersAData.map((p) => p._id));
          const playersBIds = new Set(playersBData.map((p) => p._id));
          cards
            .filter((c) => c.matchId === selectedMatch._id) // <-- Only use cards for this match
            .forEach((c) => {
              if (playersAIds.has(c.playerId)) {
                cardsAInit[c.playerId] = c.type;
              } else if (playersBIds.has(c.playerId)) {
                cardsBInit[c.playerId] = c.type;
              }
            });
          setCardsA(cardsAInit);
          setCardsB(cardsBInit);
        });
      }
    });
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

  // Add handlers for the checkboxes
  const handlePlayedGameChangeA = (e) => {
    const { name, checked } = e.target;
    const playerId = name.split("-")[1];
    setPlayedGamesA((prev) => ({
      ...prev,
      [playerId]: checked,
    }));
  };

  const handlePlayedGameChangeB = (e) => {
    const { name, checked } = e.target;
    const playerId = name.split("-")[1];
    setPlayedGamesB((prev) => ({
      ...prev,
      [playerId]: checked,
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

  // Build cards array as before
  const rawCards = [
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

  // Deduplicate: keep only the latest card for each playerId
  const cardsMap = new Map();
  rawCards.forEach((card) => {
    cardsMap.set(card.playerId, card); // overwrites previous, so latest wins
  });
  const cards = Array.from(cardsMap.values());

  // Sort games chronologically
  const sortedGames = [...scheduledGames].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Add a handler for resetting the match
  const handleResetMatch = async () => {
    if (!selectedMatchId) return;
    await resetMatch(selectedMatchId);
    setScoresA({});
    setScoresB({});
    setCardsA({});
    setCardsB({});
    setPlayedGamesA({});
    setPlayedGamesB({});
    if (onResetSuccess) onResetSuccess(); // <-- call parent handler
  };

  return (
    <form
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();

        // Collect which players played
        const playersWhoPlayed = [
          ...Object.entries(playedGamesA)
            .filter(([_, played]) => played)
            .map(([playerId, _]) => playerId),
          ...Object.entries(playedGamesB)
            .filter(([_, played]) => played)
            .map(([playerId, _]) => playerId),
        ];

        onSubmit(e, {
          selectedMatchId,
          scoresA,
          scoresB,
          playersA,
          playersB,
          goals,
          cards,
          cardsA, // <-- add this
          cardsB, // <-- add this
          playersWhoPlayed, // Send this to the parent
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
        <label className="block mb-1 font-medium">
          Buteurs, cartons et participation
        </label>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-[2fr_0.7fr_1.2fr_0.8fr] gap-1 mb-2 text-xs font-medium">
              <span>Joueur</span>
              <span className="text-center">Buts</span>
              <span className="text-center">Cartons</span>
              <span className="text-center">Joué</span>
            </div>
            <ScorerForm
              players={playersA}
              onChange={handleChangeA}
              scores={scoresA}
              cards={cardsA}
              onCardChange={handleCardChangeA}
              playedGames={playedGamesA}
              onPlayedGameChange={handlePlayedGameChangeA}
            />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-[2fr_0.7fr_1.2fr_0.8fr] gap-1 mb-2 text-xs font-medium">
              <span>Joueur</span>
              <span className="text-center">Buts</span>
              <span className="text-center">Cartons</span>
              <span className="text-center">Joué</span>
            </div>
            <ScorerForm
              players={playersB}
              onChange={handleChangeB}
              scores={scoresB}
              cards={cardsB}
              onCardChange={handleCardChangeB}
              playedGames={playedGamesB}
              onPlayedGameChange={handlePlayedGameChangeB}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn btn-success" type="submit">
          {submitLabel}
        </button>
        <button
          className="btn btn-warning"
          type="button"
          onClick={handleResetMatch}
          disabled={!selectedMatchId}
        >
          Réinitialiser
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
