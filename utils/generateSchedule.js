export function generateSchedule(teams, data) {
  const schedule = [];
  const teamCount = teams.length;

  if (teamCount % 2 !== 0) {
    teams.push("BYE");
  }

  const totalRounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  const teamList = [...teams];

  // Helper: rotation circulaire
  Array.prototype.rotateRight = function (count = 1) {
    return this.slice(-count).concat(this.slice(0, -count));
  };

  let matchIndex = 0;

  for (let round = 0; round < totalRounds; round++) {
    const roundMatches = [];

    for (let match = 0; match < matchesPerRound; match++) {
      const home = teamList[match];
      const away = teamList[teamList.length - 1 - match];

      if (home !== "BYE" && away !== "BYE") {
        const date = new Date(data.firstSunday);
        date.setDate(date.getDate() + 7 * round); // chaque semaine

        const hourOffset = Math.floor((matchIndex % 4) / 2); // 0 ou 1 (deux créneaux max)
        const time = `${parseInt(data.startTime.split(":")[0]) + hourOffset}`.padStart(2, "0") + ":" + data.startTime.split(":")[1];
        const location = (matchIndex % 2 === 0)
          ? "Séminaire Saint-Joseph 1"
          : "Séminaire Saint-Joseph 2";

        roundMatches.push({
          day: round + 1,
          location,
          time,
          date: date.toISOString().split("T")[0],
          teamA: home._id,
          teamB: away._id,
          status: "scheduled",
          scoreA: null,
          scoreB: null,
        });

        matchIndex++;
      }
    }

    schedule.push(...roundMatches);
    const fixed = teamList[0];
    const rotated = [fixed, ...teamList.slice(1).rotateRight(1)];
    teamList.splice(0, teamList.length, ...rotated);
  }

  return schedule;
}
