import { getPlayers, fetchGames } from "@/utils/api";
import { calculateSuspensions } from "@/utils/calculateSusupensions";
import { updateSuspensionTime } from "@/utils/calculateSuspensionTime";

/**
 * Refreshes the goals and cards for all players in the league,
 * updates their stats in the database, and calculates suspensions if needed.
 * Also updates suspension time for all players of the teams involved in the last match.
 */
export async function refreshScorers() {
  const players = await getPlayers();
  const schedule = Object.values(await fetchGames());

  if (!players || players.length === 0) return;

  // Fetch all cards for all played games
  const cardsRes = await fetch("/api/cards");
  const allCards = cardsRes.ok ? await cardsRes.json() : [];

  const playedGames = schedule.filter((game) => game.status === "played");
  const lastGame = playedGames[playedGames.length - 1];

  // Update suspension time for all players of both teams in the last match
  if (lastGame && lastGame.teamA && lastGame.teamB) {
    await updateSuspensionTime(lastGame.teamA);
    await updateSuspensionTime(lastGame.teamB);
  }

  await Promise.all(
    players.map(async (player) => {
      try {
        // Fetch current suspensions for this player
        const suspensionsRes = await fetch(
          `/api/suspensions?player_id=${player._id}`
        );
        const currentSuspensions = suspensionsRes.ok
          ? await suspensionsRes.json()
          : [];

        // Find the latest suspension match for this player
        const lastSuspensionMatchId = currentSuspensions.length
          ? currentSuspensions.reduce((latest, s) => {
              if (!latest) return s.start_match_id;
              return s.start_match_id > latest ? s.start_match_id : latest;
            }, null)
          : null;

        // Gather all cards for this player from matches after last suspension
        const allPlayerCards = allCards
          .filter(
            (card) =>
              card.playerId === player._id &&
              (!lastSuspensionMatchId || card.matchId > lastSuspensionMatchId)
          );

        // Calculate stats as before
        const yellowCards = allCards.filter(
          (c) =>
            c.playerId === player._id &&
            (c.type === "yellow" || c.type === "yellow/red")
        ).length;

        const redCards = allCards.filter(
          (c) => c.playerId === player._id && c.type === "red"
        ).length;

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

        // Calculate suspensions using only new cards
        const newSuspensions = calculateSuspensions(
          allPlayerCards,
          playedGames.length ? playedGames[playedGames.length - 1]._id : null
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
        // Only log errors
        console.error("Error updating player or suspensions:", player._id, err);
      }
    })
  );
}
