import { getPlayers, fetchGames } from "@/utils/api";
import { calculateSuspensions } from "@/utils/calculateSusupensions";

/**
 * Refreshes the goals and cards for all players in the league,
 * updates their stats in the database, and calculates suspensions if needed.
 */
export async function refreshScorers() {
  console.log("refreshScorers called");
  const players = await getPlayers();
  console.log("Players fetched:", players.length);
  const schedule = Object.values(await fetchGames());

  if (!players || players.length === 0) return;

  await Promise.all(
    players.map(async (player) => {
      try {
        const playedGames = schedule.filter((game) => game.status === "played");

        // Get all cards for this player in the last played game
        const lastGame = playedGames[playedGames.length - 1];
        const lastGameCards =
          lastGame && Array.isArray(lastGame.cards)
            ? lastGame.cards.filter((c) => c.playerId === player._id)
            : [];

        // Only log lastGame.cards for debugging
        console.log("lastGame.cards:", lastGame && lastGame.cards);

        const yellowCards = playedGames.reduce(
          (sum, game) =>
            sum +
            (Array.isArray(game.cards)
              ? game.cards.filter(
                  (c) => c.playerId === player._id && c.type === "yellow"
                ).length
              : 0),
          0
        );

        const redCards = playedGames.reduce(
          (sum, game) =>
            sum +
            (Array.isArray(game.cards)
              ? game.cards.filter(
                  (c) => c.playerId === player._id && c.type === "red"
                ).length
              : 0),
          0
        );

        const goalsCount = playedGames.reduce(
          (sum, game) =>
            sum +
            (Array.isArray(game.goals)
              ? game.goals.filter((g) => g.playerId === player._id).length
              : 0),
          0
        );

        // Update player's goals and cards in the database
        await fetch(`/api/players`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: player._id,
            goals: goalsCount,
            yellowCards: yellowCards,
            redCards: redCards,
          }),
        });

        // Fetch current suspensions for this player
        const suspensionsRes = await fetch(
          `/api/suspensions?player_id=${player._id}`
        );
        const currentSuspensions = suspensionsRes.ok
          ? await suspensionsRes.json()
          : [];

        const updatedPlayer = { ...player, yellowCards, redCards };
        // Gather all cards for this player from all played games
        const allPlayerCards = playedGames
          .flatMap((game) => (Array.isArray(game.cards) ? game.cards : []))
          .filter((card) => card.playerId === player._id);

        // Calculate suspensions using all cards
        const newSuspensions = calculateSuspensions(
          [updatedPlayer],
          allPlayerCards,
          currentSuspensions,
          playedGames.length ? playedGames[playedGames.length - 1]._id : null // or pass null if not needed
        );

        // Find suspensions that should be removed (active but not needed anymore)
        const shouldExistIds = newSuspensions.map((s) => s.start_match_id);
        const toRemove = currentSuspensions.filter(
          (s) => !shouldExistIds.includes(s.start_match_id)
        );

        // Remove obsolete suspensions
        await Promise.all(
          toRemove.map((suspension) =>
            fetch(`/api/suspensions?id=${suspension.id}`, {
              method: "DELETE",
            })
          )
        );

        // Create new suspensions as before
        await Promise.all(
          newSuspensions.map((suspension) =>
            fetch("/api/suspensions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(suspension),
            })
          )
        );
      } catch (err) {
        console.error("Error updating player or suspensions:", player._id, err);
      }
    })
  );
}
