export async function exportSchedule(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    throw new Error("Le calendrier est vide ou invalide.");
  }

  try {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ games: schedule }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur d'envoi : ${res.status} — ${errorText}`);
    }

    const result = await res.json();
    console.log("✅ Matchs exportés avec succès :", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'exportation des matchs :", error);
    throw error;
  }
}
