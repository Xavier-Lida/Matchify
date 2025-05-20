fetch('data/matchs.json')
  .then(res => res.json())
  .then(matchs => {
    const stats = {};

    matchs.forEach(match => {
      if (match.score1 == null || match.score2 == null) return; // ignorer si pas encore joué

      // Initialiser les équipes si pas encore dans stats
      [match.equipe1, match.equipe2].forEach(equipe => {
        if (!stats[equipe]) {
          stats[equipe] = {
            equipe: equipe, MJ: 0, V: 0, N: 0, D: 0, BP: 0, BC: 0, Pts: 0
          };
        }
      });

      const team1 = stats[match.equipe1];
      const team2 = stats[match.equipe2];

      team1.MJ++; team2.MJ++;
      team1.BP += match.score1; team1.BC += match.score2;
      team2.BP += match.score2; team2.BC += match.score1;

      if (match.score1 > match.score2) {
        team1.V++; team2.D++;
        team1.Pts += 3;
      } else if (match.score1 < match.score2) {
        team2.V++; team1.D++;
        team2.Pts += 3;
      } else {
        team1.N++; team2.N++;
        team1.Pts += 1;
        team2.Pts += 1;
      }
    });

    const classement = Object.values(stats).map(e => ({
      ...e,
      Diff: e.BP - e.BC
    }));

    classement.sort((a, b) => 
      b.Pts - a.Pts || b.Diff - a.Diff || b.BP - a.BP
    );

    const tbody = document.querySelector('#classement tbody');
    classement.forEach(equipe => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${equipe.equipe}</td>
        <td>${equipe.MJ}</td>
        <td>${equipe.V}</td>
        <td>${equipe.N}</td>
        <td>${equipe.D}</td>
        <td>${equipe.BP}</td>
        <td>${equipe.BC}</td>
        <td>${equipe.Diff}</td>
        <td>${equipe.Pts}</td>
      `;
      tbody.appendChild(row);
    });
  });
