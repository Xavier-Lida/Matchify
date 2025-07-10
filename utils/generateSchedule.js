export function generateSchedule(teams, data) {
  const schedule = [];
  const trimester = data.trimester || 1;

  // 1. Group teams by division
  const divisions = {};
  teams.forEach((team) => {
    if (!divisions[team.division]) divisions[team.division] = [];
    divisions[team.division].push(team);
  });

  // 2. Prepare locations and time slots
  const mainFields = ["Séminaire 1", "Séminaire 2"];
  const backupField = "Séminaire 3";
  const startHour = parseInt(data.startTime.split(":")[0]);
  const minute = data.startTime.split(":")[1];
  const slotsPerDay = 4; // 4 slots per field per night

  // 3. Track used slots and backup field usage
  const usedSlots = new Set();
  const usedSeminaire3 = new Set(); // Set of dates where Séminaire 3 is used

  // 4. Generate schedule for each division
  Object.values(divisions).forEach((divisionTeams) => {
    let teamList = [...divisionTeams];
    if (teamList.length % 2 !== 0) {
      teamList.push("BYE");
    }

    const totalRounds = teamList.length - 1;
    const matchesPerRound = teamList.length / 2;

    for (let round = 0; round < totalRounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const home = teamList[match];
        const away = teamList[teamList.length - 1 - match];

        if (home !== "BYE" && away !== "BYE") {
          const dateObj = new Date(data.firstSunday);
          dateObj.setDate(dateObj.getDate() + 7 * round);
          const date = dateObj.toISOString().split("T")[0];

          let slotFound = false;

          // Try main fields first
          for (let slot = 0; slot < slotsPerDay * mainFields.length; slot++) {
            const hourOffset = Math.floor(slot / mainFields.length);
            const locationIdx = slot % mainFields.length;
            const time = `${(startHour + hourOffset)
              .toString()
              .padStart(2, "0")}:${minute}`;
            const location = mainFields[locationIdx];
            const slotKey = `${date}|${time}|${location}`;

            if (!usedSlots.has(slotKey)) {
              usedSlots.add(slotKey);

              schedule.push({
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

          // If not found, try backup field for division 3 (once per night)
          if (!slotFound && home.division === 3 && !usedSeminaire3.has(date)) {
            for (let hourOffset = 0; hourOffset < slotsPerDay; hourOffset++) {
              const time = `${(startHour + hourOffset)
                .toString()
                .padStart(2, "0")}:${minute}`;
              const slotKey = `${date}|${time}|${backupField}`;
              if (!usedSlots.has(slotKey)) {
                usedSlots.add(slotKey);
                usedSeminaire3.add(date);

                schedule.push({
                  day: round + 1,
                  location: backupField,
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
          }

          if (!slotFound) {
            console.warn(
              `No available slot for match: ${home.name} vs ${away.name} on ${date}`
            );
          }
        }
      }

      // Rotate teams for next round (standard round-robin)
      const fixed = teamList[0];
      const last = teamList.pop();
      teamList.splice(1, 0, last);
    }
  });

  return schedule;
}
