import { getPlayers } from "@/utils/api";

/**
 * Updates the remaining suspension time for all players of a team after a match is entered.
 * Reduces matches_remaining by 1 for each active suspension.
 * If matches_remaining reaches 0, deletes the suspension.
 * @param {String} teamId - The team whose match was just played.
 */
export async function updateSuspensionTime(teamId) {
  // Fetch all suspensions
  const suspensionsRes = await fetch("/api/suspensions");
  const suspensions = suspensionsRes.ok ? await suspensionsRes.json() : [];
  console.log("Fetched suspensions:", suspensions);

  // Fetch all players and filter by teamId
  const allPlayers = await getPlayers();
  console.log("Fetched players:", allPlayers);

  const teamPlayerIds = allPlayers
    .filter((p) => p.teamId === teamId)
    .map((p) => p._id);
  console.log("Team player IDs for team", teamId, ":", teamPlayerIds);

  const activeSuspensions = suspensions.filter(
    (s) => teamPlayerIds.includes(s.player_id) && s.matches_remaining > 0
  );
  console.log("Active suspensions for team:", activeSuspensions);

  await Promise.all(
    activeSuspensions.map(async (suspension) => {
      const newRemaining = suspension.matches_remaining - 1;
      console.log(
        `Updating suspension ${suspension.id} for player ${suspension.player_id}: new matches_remaining = ${newRemaining}`
      );
      if (newRemaining <= 0) {
        console.log(`Deleting suspension ${suspension.id}`);
        await fetch(`/api/suspensions?id=${suspension.id}`, {
          method: "DELETE",
        });
      } else {
        console.log(
          `Updating suspension ${suspension.id} to matches_remaining = ${newRemaining}`
        );
        await fetch(`/api/suspensions`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...suspension,
            matches_remaining: newRemaining,
          }),
        });
      }
    })
  );
}
