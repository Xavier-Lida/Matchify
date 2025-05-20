fetch('data/matchs.json')
  .then(res => res.json())
  .then(matchs => {
    const match = matchs.find(m => m.id === 1); // 🟡 remplace 1 par l’id voulu
    const div = document.getElementById('feuille');
    div.innerHTML = `
      <p><strong>${match.receveur}</strong> vs <strong>${match.visiteur}</strong></p>
      <p>Date : ${match.date} à ${match.heure}</p>
      <p>Terrain : ${match.terrain}</p>
      <hr>
      <h3>Présence des joueurs</h3>
      <table border="1" cellpadding="5">
        <tr><th>Équipe 1</th><th>Équipe 2</th></tr>
        <tr><td><br><br><br></td><td><br><br><br></td></tr>
      </table>
    `;
  });
