/**
 * Calculates suspensions based on cards, marks used cards, and creates suspension objects if needed.
 * @param {Array} cards - Array of card objects for the last game (each with playerId, type, used).
 * @param {String} matchId - The ID of the last game.
 * @returns {Array} Array of new suspension objects to be created.
 */
export function calculateSuspensions(cards, matchId) {
  const newSuspensions = [];
  const usedCardIds = new Set();

  // Group cards by playerId
  const cardsByPlayer = {};
  cards.forEach((card) => {
    if (!card.used) {
      if (!cardsByPlayer[card.playerId]) cardsByPlayer[card.playerId] = [];
      cardsByPlayer[card.playerId].push(card);
    }
  });

  Object.entries(cardsByPlayer).forEach(([playerId, playerCards]) => {
    const yellowCards = playerCards.filter((c) => c.type === "yellow");
    const yellowRedCards = playerCards.filter((c) => c.type === "yellow/red");
    const redCards = playerCards.filter((c) => c.type === "red");

    // --- 2 YELLOW CARDS IN SAME MATCH (yellow/red) ---
    if (yellowRedCards.length > 0) {
      yellowRedCards.forEach((card) => usedCardIds.add(card._id));
      newSuspensions.push({
        player_id: playerId,
        reason: "2 cartons jaunes dans le même match",
        start_match_id: matchId,
        matches_remaining: 1,
      });
      // Mark all yellow cards as used too (if needed)
      yellowCards.forEach((card) => usedCardIds.add(card._id));
      return;
    }

    // --- 3 YELLOW CARDS CUMULATED ---
    if (yellowCards.length >= 3) {
      yellowCards.slice(0, 3).forEach((card) => usedCardIds.add(card._id));
      newSuspensions.push({
        player_id: playerId,
        reason: "3 cartons jaunes cumulés",
        start_match_id: matchId,
        matches_remaining: 1,
      });
      return;
    }

    // --- RED CARD SUSPENSIONS ---
    if (redCards.length > 0) {
      redCards.forEach((card) => usedCardIds.add(card._id));
      newSuspensions.push({
        player_id: playerId,
        reason: "1 carton rouge direct",
        start_match_id: matchId,
        matches_remaining: 1,
      });
      return;
    }
  });

  // Mark cards as used
  cards.forEach((card) => {
    if (usedCardIds.has(card._id)) {
      card.used = true;
    }
  });

  return newSuspensions;
}
