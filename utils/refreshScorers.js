import { getPlayers, fetchGames } from "@/utils/api";

/**
 * Refreshes the goals for all players in the league and updates their stats in the database.
 */
export async function refreshScorers() {
  console.log("refreshScorers called");
  const players = await getPlayers();
  console.log("Players fetched:", players.length);
  const schedule = Object.values(await fetchGames());

  if (!players || players.length === 0) return;

  // For each player, count total goals in all played games
  await Promise.all(
    players.map(async (player) => {
      try {
        const goalsCount = schedule
          .filter(
            (game) => game.status === "played" && Array.isArray(game.goals)
          )
          .reduce(
            (sum, game) =>
              sum +
              (Array.isArray(game.goals)
                ? game.goals.filter((g) => g.playerId === player._id).length
                : 0),
            0
          );

        // Test log for debugging
        console.log(
          `Player: ${player.firstName} ${player.lastName} (${player._id}) - Goals: ${goalsCount}`
        );

        // Update player's goals in the database
        await fetch(`/api/players`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: player._id,
            goals: goalsCount,
          }),
        });
      } catch (err) {
        console.error("Error updating player:", player._id, err);
      }
    })
  );
}
