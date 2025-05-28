/**
 * Cleans and validates an array of player objects.
 * Removes empty rows, trims strings, and ensures valid numbers.
 * Keeps firstName and lastName as separate fields.
 * Prevents duplicate numbers in the import list.
 * @param {Array} players - [{ firstName, lastName, number }]
 * @returns {Array} Cleaned players
 */
export function cleanPlayers(players, teamId) {
  const seenNumbers = new Set();
  return players
    .map((p) => ({
      _id: p._id || undefined,
      teamId: teamId || null,
      firstName: (p.firstName || "").trim(),
      lastName: (p.lastName || "").trim(),
      number: Number(p.number),
      gamesPlayed: 0,
      goals: 0,
      yellowCards: 0,
      redCards: 0,
      suspended: false,
      profilePicture: "",
    }))
    .filter(
      (p) =>
        p.firstName.length > 0 &&
        p.lastName.length > 0 &&
        p.number >= 0 &&
        !seenNumbers.has(p.number) &&
        seenNumbers.add(p.number)
    );
}

/**
 * Sends only new players (not already in DB) to the backend API for database insertion.
 * Updates existing players if they have an _id.
 * @param {Array} players - Cleaned player objects
 * @param {String} teamId - Team ID to filter existing players
 * @returns {Promise<Response>}
 */
export async function sendPlayersToDb(players, teamId) {
  if (!teamId) {
    throw new Error("teamId is required for sendPlayersToDb");
  }

  // Fetch existing players for this team
  const existingRes = await fetch(`/api/players?teamId=${teamId}`);
  const existingPlayers = await existingRes.json();

  // Use number as unique identifier (adjust if needed)
  const existingNumbers = new Set(existingPlayers.map((p) => p.number));
  const newPlayers = players.filter(
    (p) => !p._id && !existingNumbers.has(p.number)
  );

  // Only update players whose attributes have changed
  const updatedPlayers = players.filter((p) => {
    if (!p._id) return false;
    const original = existingPlayers.find(
      (orig) => orig._id?.toString() === p._id?.toString()
    );
    if (!original) return false;
    return (
      p.firstName !== original.firstName ||
      p.lastName !== original.lastName ||
      p.number !== original.number
    );
  });

  // Insert new players
  if (newPlayers.length > 0) {
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: newPlayers }),
    });
    if (!res.ok) {
      throw new Error("Failed to import players");
    }
  }

  // Update only changed players
  for (const player of updatedPlayers) {
    const res = await fetch("/api/players", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) {
      throw new Error(`Failed to update player ${player._id}`);
    }
  }

  return {
    insertedCount: newPlayers.length,
    updatedCount: updatedPlayers.length,
  };
}
