/**
 * Calculates suspensions for players based on cards and creates suspension objects if needed.
 * @param {Array} players - Array of player objects.
 * @param {Array} cards - Array of card objects for the last game (each with playerId and type).
 * @param {Array} currentSuspensions - Array of current suspension objects.
 * @param {String} matchId - The ID of the last game.
 * @returns {Array} Array of new suspension objects to be created.
 */
export function calculateSuspensions(
  players,
  cards,
  currentSuspensions,
  matchId
) {
  const newSuspensions = [];

  players.forEach((player) => {
    // Count yellow and red cards for this player
    const yellowCardsThisMatch = cards.filter(
      (card) => card.playerId === player._id && card.type === "yellow"
    ).length;
    const twoYellowCardsThisMatch = cards.filter(
      (card) => card.playerId === player._id && card.type === "yellow/red"
    ).length;
    const redCardsThisMatch = cards.filter(
      (card) => card.playerId === player._id && card.type === "red"
    ).length;

    // Get cumulative yellow/red cards from player object
    const totalYellow = player.yellowCards || 0;
    const totalRed = player.redCards || 0;

    // --- YELLOW CARD SUSPENSIONS ---
    // 2 yellow cards in the same match
    if (twoYellowCardsThisMatch) {
      newSuspensions.push({
        player_id: player._id,
        reason: "2 cartons jaunes dans le même match",
        start_match_id: matchId,
        matches_remaining: 1,
      });
      return;
    }

    // 3 yellow cards in 3 different matches (cumulative)
    // After first suspension, next is at 2, then at 1 (series logic)
    let yellowThreshold = 3;
    if (player.yellowSeriesStep === 1) yellowThreshold = 2;
    if (player.yellowSeriesStep === 2) yellowThreshold = 1;
    if (totalYellow >= yellowThreshold) {
      newSuspensions.push({
        player_id: player._id,
        reason: `${yellowThreshold} cartons jaunes cumulés`,
        start_match_id: matchId,
        matches_remaining: 1,
      });
      // You should update player.yellowSeriesStep after suspension is served
      return;
    }

    // --- RED CARD SUSPENSIONS ---
    if (redCardsThisMatch > 0) {
      // 1st red card
      if (totalRed === 1) {
        newSuspensions.push({
          player_id: player._id,
          reason: "1 carton rouge direct",
          start_match_id: matchId,
          matches_remaining: 1,
        });
        return;
      }
      // 2nd red card
      if (totalRed === 2) {
        newSuspensions.push({
          player_id: player._id,
          reason: "2ème carton rouge direct",
          start_match_id: matchId,
          matches_remaining: 5,
        });
        return;
      }
      // 3rd red card
      if (totalRed >= 3) {
        newSuspensions.push({
          player_id: player._id,
          reason: "3ème carton rouge direct - exclusion saison",
          start_match_id: matchId,
          matches_remaining: 99, // Use a high number for exclusion
        });
        return;
      }
    }
  });

  return newSuspensions;
}
