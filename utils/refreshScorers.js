import { getPlayers, fetchGames } from "@/utils/api";

/**
 * Refreshes the goals and cards for all players in the league,
 * updates their stats in the database.
 */
export async function refreshScorers() {
  const players = await getPlayers();
  const scheduleObj = await fetchGames();
  const schedule = Object.values(scheduleObj); // Array of all games
  const playedGames = schedule.filter((game) => game.status === "played");

  if (!players || players.length === 0) return;

  // Fetch all cards for all played games
  const cardsRes = await fetch("/api/cards");
  const allCards = cardsRes.ok ? await cardsRes.json() : [];

  await Promise.all(
    players.map(async (player) => {
      try {
        // 1. Calculate stats
        const playerCards = allCards.filter((c) => c.playerId === player._id);
        const yellowCards = playerCards.filter(
          (c) => c.type === "yellow" || c.type === "yellow/red"
        ).length;
        const redCards = playerCards.filter((c) => c.type === "red").length;
        const goalsCount = playedGames.reduce(
          (sum, game) =>
            sum +
            (Array.isArray(game.goals)
              ? game.goals.filter((g) => g.playerId === player._id).length
              : 0),
          0
        );

        // 2. Update player's stats
        await fetch(`/api/players`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: player._id,
            goals: goalsCount,
            yellowCards,
            redCards,
          }),
        });
      } catch (err) {
        console.error("Error updating player stats:", player._id, err);
      }
    })
  );
}
