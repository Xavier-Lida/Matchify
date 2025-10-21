import { getTeams, fetchGames } from "@/utils/api";
import { calculateTeamStats } from "@/utils/calculateGames";
import { calculatePlayerStats } from "@/utils/calculateResults";

/**
 * Refreshes teams, schedule, and updates stats for ALL teams and players after a match entry.
 * @param {Function} setTeams - Setter for teams state.
 * @param {Function} setSchedule - Setter for schedule state.
 */
export async function refreshResults({
  selectedMatchId,
  goals,
  cards,
  setTeams,
  setSchedule,
}) {
  // 1. Refetch the updated schedule
  const updatedSchedule = await fetchGames();
  const scheduleArr = Object.values(updatedSchedule);
  setSchedule(scheduleArr);

  // 2. Refetch all teams
  const allTeams = await getTeams();

  // 3. Update stats for ALL teams
  await Promise.all(
    allTeams.map(async (team) => {
      const stats = calculateTeamStats(team._id, scheduleArr);
      const update = {
        ...stats,
        points: stats.wins * 3 + stats.draws,
        goalDifference: stats.goalsFor - stats.goalsAgainst,
      };
      await fetch(`/api/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...team, ...update }),
      });
    })
  );

  // 4. Update stats for ALL players in ALL teams
  const allPlayers = allTeams.flatMap((team) => team.players || []);
  await Promise.all(
    allPlayers.map(async (player) => {
      const stats = calculatePlayerStats(
        player,
        scheduleArr,
        selectedMatchId,
        goals,
        cards
      );
      await fetch(`/api/players?id=${player._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals: stats.goals,
          yellowCards: stats.yellowCards,
          redCards: stats.redCards,
        }),
      });
    })
  );

  // 5. Update match details for the played game
  const { scoreA, scoreB } = goals;
  await fetch(`/api/games`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id: selectedMatchId,
      scoreA,
      scoreB,
      status: "played",
      goals,
    }),
  });

  // 6. Update teams state in UI
  const updatedTeams = await getTeams();
  updatedTeams.sort((a, b) => a.name.localeCompare(b.name));
  setTeams(updatedTeams);
}
