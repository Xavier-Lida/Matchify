/**
 * Cleans and validates an array of player objects.
 * Removes empty rows, trims strings, and ensures valid numbers.
 * Keeps firstName and lastName as separate fields.
 * @param {Array} players - [{ firstName, lastName, number }]
 * @returns {Array} Cleaned players
 */
export function cleanPlayers(players, teamId) {
  return players
    .map((p) => ({
      teamId: teamId || null,
      firstName: (p.firstName || "").trim(),
      lastName: (p.lastName || "").trim(),
      number: p.number ? String(p.number).trim() : "",
      gamesPlayed: 0,
      goals: 0,
      yellowCards: 0,
      redCards: 0,
      suspended: false,
      profilePicture: "",
    }))
    .filter(
      (p) =>
        (p.firstName && p.firstName.length > 0) ||
        (p.lastName && p.lastName.length > 0) ||
        (p.number && p.number.length > 0)
    );
}

/**
 * Sends only new players (not already in DB) to the backend API for database insertion.
 * @param {Array} players - Cleaned player objects
 * @param {String} teamId - Team ID to filter existing players
 * @returns {Promise<Response>}
 */
export async function sendPlayersToDb(players, teamId) {
  // Fetch existing players for this team
  const existingRes = await fetch(`/api/players?teamId=${teamId}`);
  const existingPlayers = await existingRes.json();

  // Use number as unique identifier (adjust if needed)
  const existingNumbers = new Set(existingPlayers.map((p) => p.number));
  const newPlayers = players.filter((p) => !existingNumbers.has(p.number));

  if (newPlayers.length === 0) {
    return { insertedCount: 0, message: "No new players to import." };
  }

  const res = await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ players: newPlayers }),
  });
  if (!res.ok) {
    throw new Error("Failed to import players");
  }
  return res.json();
}
