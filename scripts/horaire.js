fetch('data/matchs.json')
  .then(response => response.json())
  .then(matchs => {
    const container = document.getElementById('matchs');
    matchs.forEach(match => {
      const div = document.createElement('div');
      div.className = 'match';
      div.innerHTML = `
        <strong>${match.receveur}</strong> vs <strong>${match.visiteur}</strong><br>
        📅 ${match.date} à ${match.heure}<br>
        📍 ${match.terrain}
      `;
      container.appendChild(div);
    });
  });
