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
export async function getPlayersByTeamId(teamId) {
  try {
    const response = await fetch(`/api/players?teamId=${teamId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
}
export async function updateTeam(team) {
  try {
    await fetch(`/api/teams`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}
export async function deleteTeam(teamId) {
  try {
    await fetch(`/api/teams?id=${teamId}`, { method: "DELETE" });
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
}