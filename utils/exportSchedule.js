export async function exportSchedule(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    throw new Error("Le calendrier est vide ou invalide.");
  }

  try {
    // 1. Supprimer les anciens matchs planifiés
    const deleteRes = await fetch("/api/games?status=scheduled", {
      method: "DELETE",
    });

    if (!deleteRes.ok) {
      const errorText = await deleteRes.text();
      throw new Error(`Erreur lors de la suppression : ${deleteRes.status} — ${errorText}`);
    }

    console.log("🗑 Ancien calendrier supprimé.");

    // 2. Insérer le nouvel horaire
    const insertRes = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ games: schedule }),
    });

    if (!insertRes.ok) {
      const errorText = await insertRes.text();
      throw new Error(`Erreur d'insertion : ${insertRes.status} — ${errorText}`);
    }

    const result = await insertRes.json();
    console.log("✅ Nouveau calendrier exporté avec succès :", result);
    return result;
  } catch (error) {
    console.error("❌ Erreur dans exportSchedule :", error);
    throw error;
  }
}
