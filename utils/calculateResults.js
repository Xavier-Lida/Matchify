export function calculatePlayerStats(
  player,
  schedule,
  selectedMatchId,
  goals,
  cards
) {
  // Calculate total goals for this player in all played games (including this one)
  const allGames = schedule
    .map((g) =>
      g._id === selectedMatchId ? { ...g, goals, cards, status: "played" } : g
    )
    .filter((g) => g.status === "played" && g.goals);

  const goalsCount = allGames.reduce(
    (sum, game) =>
      sum +
      (Array.isArray(game.goals)
        ? game.goals.filter((g) => g.playerId === player._id).length
        : 0),
    0
  );
  const yellowCards = allGames.reduce(
    (sum, game) =>
      sum +
      (Array.isArray(game.cards)
        ? game.cards.filter(
            (c) => c.playerId === player._id && c.type === "yellow"
          ).length
        : 0),
    0
  );
  const redCards = allGames.reduce(
    (sum, game) =>
      sum +
      (Array.isArray(game.cards)
        ? game.cards.filter(
            (c) => c.playerId === player._id && c.type === "red"
          ).length
        : 0),
    0
  );

  return { goals: goalsCount, yellowCards: yellowCards, redCards: redCards }; 
}
