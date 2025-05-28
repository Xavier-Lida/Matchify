export function generateSchedule(teams, isHomeAndAway = false) {
  const schedule = [];
  const teamCount = teams.length;

  if (teamCount % 2 !== 0) {
    teams.push("BYE");
  }

  const totalRounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  const teamList = [...teams];

  for (let round = 0; round < totalRounds; round++) {
    const roundMatches = [];

    for (let match = 0; match < matchesPerRound; match++) {
      const home = teamList[match];
      const away = teamList[teamList.length - 1 - match];

      if (home !== "BYE" && away !== "BYE") {
        roundMatches.push({
          day: round + 1,
          teamA: home,
          teamB: away,
          status: "scheduled",
        });
      }
    }

    schedule.push(...roundMatches);

    // Rotation round-robin
    const fixed = teamList[0];
    const rotated = [fixed, ...teamList.slice(1).rotateRight(1)];
    teamList.splice(0, teams.length, ...rotated);
  }

//   if (isHomeAndAway) {
//     const reversedMatches = schedule.map((match, i) => ({
//       ...match,
//       day: schedule[schedule.length - 1].day + Math.floor(i / matchesPerRound) + 1,
//       teamA: match.teamB,
//       teamB: match.teamA,
//     }));
//     schedule.push(...reversedMatches);
//   }

  return schedule;
}

// Petit helper pour tourner un tableau
Array.prototype.rotateRight = function (count = 1) {
  return this.slice(-count).concat(this.slice(0, -count));
};
