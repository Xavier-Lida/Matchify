export function generateSchedule(teams, data) {
  const schedule = [];
  const trimester = data.trimester || 1; // Default to 1 if not provided

  // 1. Group teams by division
  const divisions = {};
  teams.forEach((team) => {
    if (!divisions[team.division]) divisions[team.division] = [];
    divisions[team.division].push(team);
  });

  // 2. Prepare all possible locations and time slots
  const locations = ["Séminaire Saint-Joseph 1", "Séminaire Saint-Joseph 2"];
  const startHour = parseInt(data.startTime.split(":")[0]);
  const minute = data.startTime.split(":")[1];
  const slotsPerDay = 2; // adjust if you want more/less slots per day

  // 3. Track used slots globally
  const usedSlots = new Set();

  // 4. Generate schedule for each division
  Object.values(divisions).forEach((divisionTeams) => {
    let teamList = [...divisionTeams];
    if (teamList.length % 2 !== 0) {
      teamList.push("BYE");
    }

    const totalRounds = teamList.length - 1;
    const matchesPerRound = teamList.length / 2;

    let matchIndex = 0;

    for (let round = 0; round < totalRounds; round++) {
      const roundMatches = [];

      for (let match = 0; match < matchesPerRound; match++) {
        const home = teamList[match];
        const away = teamList[teamList.length - 1 - match];

        if (home !== "BYE" && away !== "BYE") {
          const dateObj = new Date(data.firstSunday);
          dateObj.setDate(dateObj.getDate() + 7 * round); // chaque semaine
          const date = dateObj.toISOString().split("T")[0];

          // Find the first available slot for this match
          let slotFound = false;
          for (let slot = 0; slot < slotsPerDay * locations.length; slot++) {
            const hourOffset = Math.floor(slot / locations.length);
            const locationIdx = slot % locations.length;
            const time = `${(startHour + hourOffset).toString().padStart(2, "0")}:${minute}`;
            const location = locations[locationIdx];
            const slotKey = `${date}|${time}|${location}`;

            if (!usedSlots.has(slotKey)) {
              // Slot is available
              usedSlots.add(slotKey);

              roundMatches.push({
                day: round + 1,
                location,
                time,
                date,
                teamA: home._id,
                teamB: away._id,
                division: home.division,
                trimester,
                status: "scheduled",
                scoreA: null,
                scoreB: null,
              });

              slotFound = true;
              break;
            }
          }

          if (!slotFound) {
            // If no slot is found, you can handle it (e.g., push to a "to be scheduled" list or throw an error)
            console.warn(`No available slot for match: ${home.name} vs ${away.name} on ${date}`);
          }

          matchIndex++;
        }
      }

      schedule.push(...roundMatches);
      // Rotate teams for next round (standard round-robin)
      const fixed = teamList[0];
      const last = teamList.pop();
      teamList.splice(1, 0, last);
    }
  });

  return schedule;
}