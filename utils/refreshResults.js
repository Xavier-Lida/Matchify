import { getTeams, fetchGames } from "@/utils/api";
import { calculateTeamStats } from "@/utils/calculateGames";
import { calculatePlayerStats } from "@/utils/calculateResults";

/**
 * Refreshes teams, schedule, and updates stats for ALL teams and players after a match entry.
 * @param {Function} setTeams - Setter for teams state.
 * @param {Function} setSchedule - Setter for schedule state.
 */
export async function refreshResults({ setTeams, setSchedule }) {
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
        null, // no need for selectedMatchId, recalculate for all
        [],
        []
      );
      await fetch(`/api/players`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: player._id,
          ...stats,
        }),
      });
    })
  );

  // 5. Update teams state in UI
  const updatedTeams = await getTeams();
  updatedTeams.sort((a, b) => a.name.localeCompare(b.name));
  setTeams(updatedTeams);
}
