export async function exportSchedule(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    throw new Error("Le calendrier est vide ou invalide.");
  }

  // schedule is an array of games
  let successCount = 0;
  let errorCount = 0;
  let errors = [];

  for (const game of schedule) {
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });
      if (res.ok) {
        successCount++;
      } else {
        errorCount++;
        const err = await res.json();
        errors.push(err.error || "Erreur inconnue");
      }
    } catch (e) {
      errorCount++;
      errors.push(e.message);
    }
  }

  return {
    successCount,
    errorCount,
    errors,
  };
}
