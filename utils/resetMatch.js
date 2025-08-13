/**
 * Resets a match to its default state and deletes all cards related to that match.
 * @param {string} matchId - The ID of the match to reset.
 * @returns {Promise<void>}
 */
export async function resetMatch(matchId) {
  if (!matchId) return;

  // 1. Reset the game object to its default state
  await fetch(`/api/games`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: matchId,
      scoreA: null,
      scoreB: null,
      status: "scheduled",
      goals: [],
      // Remove any other fields you want to reset here
    }),
  });

  // 2. Delete all cards related to this match
  await fetch(`/api/cards?matchId=${matchId}`, {
    method: "DELETE",
  });

  // All suspension logic removed
}