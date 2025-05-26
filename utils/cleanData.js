// cleanData : prépare les données avant de les envoyer à l'API
// (ex : génère le nom complet, convertit les nombres, ajoute une image par défaut, etc.)
export default function cleanData(rawData, apiUrl) {
  const data = { ...rawData };

  // Si on a un prénom ou un nom, on crée le champ "name"
  if ("firstName" in data || "lastName" in data) {
    data.name = `${data.firstName?.trim() || ""} ${
      data.lastName?.trim() || ""
    }`.trim();
    delete data.firstName;
    delete data.lastName;
  }

  // Vérifie que apiUrl est bien une string avant d'utiliser includes
  if (typeof apiUrl === "string" && apiUrl.includes("teams")) {
    data.points = data.points === "" ? 0 : Number(data.points);
    data.logo =
      data.logo && data.logo.trim() !== ""
        ? data.logo
        : "https://placehold.co/60x60";
  }

  if (typeof apiUrl === "string" && apiUrl.includes("players")) {
    data.goals = data.goals === "" ? 0 : Number(data.goals);
    data.photo =
      data.photo && data.photo.trim() !== ""
        ? data.photo
        : "https://placehold.co/60x60";
  }

  return data;
}
