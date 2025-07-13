export function calculateGoalsFor(teamId, games) {
  return games
    .filter((game) => game.status === "played")
    .reduce(
      (sum, game) =>
        sum +
        (Array.isArray(game.goals)
          ? game.goals.filter((goal) => goal.teamId === teamId).length
          : 0),
      0
    );
}
export function calculateGoalsForPlayer(playerId, games) {
  return games
    .filter((game) => game.status === "played")
    .reduce(
      (sum, game) =>
        sum +
        (Array.isArray(game.goals)
          ? game.goals.filter((goal) => goal.playerId === playerId).length
          : 0),
      0
    );
}
export function calculateTeamStats(teamId, games) {
  let wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0;

  games
    .filter((game) => game.status === "played")
    .forEach((game) => {
      let isTeamA = game.teamA === teamId;
      let isTeamB = game.teamB === teamId;
      if (!isTeamA && !isTeamB) return;

      const teamScore = isTeamA ? game.scoreA : game.scoreB;
      const oppScore = isTeamA ? game.scoreB : game.scoreA;

      goalsFor += teamScore;
      goalsAgainst += oppScore;

      if (teamScore > oppScore) wins++;
      else if (teamScore < oppScore) losses++;
      else draws++;
    });

  const gamesPlayed = wins + draws + losses;
  return { wins, draws, losses, gamesPlayed, goalsFor, goalsAgainst };
}
