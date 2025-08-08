import { calculateSuspensions } from "@/utils/calculateSusupensions";
import { getPlayers } from "@/utils/api";

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

  // 3. Recalculate suspensions for all players (or just for this match if you want)
  // Fetch all cards and players
  const cardsRes = await fetch("/api/cards");
  const allCards = cardsRes.ok ? await cardsRes.json() : [];
  const players = await getPlayers();

  // Optionally, recalculate for all matches/players
  // (You may want to loop through all matches and call calculateSuspensions for each)
  // Here, we just call it for the current match (should result in no suspensions after reset)
  calculateSuspensions(
    allCards.filter((card) => card.matchId === matchId),
    matchId,
    players
  );
}