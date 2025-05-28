export async function getTeams() {
  try {
    const response = await fetch("/api/teams");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}
export async function postTeam(newTeam) {
  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeam),
    });
    return response.json();
  } catch (error) {
    console.error("Error posting team:", error);
    throw error;
  }
}