const equipe = localStorage.getItem('equipeConnectee');
if (!equipe) window.location.href = 'login.html';

document.getElementById('equipeNom').textContent = equipe;

fetch('data/matchs.json')
  .then(res => res.json())
  .then(matchs => {
    const matchsEquipe = matchs.filter(
      m => m.equipe1 === equipe || m.equipe2 === equipe
    );
    const div = document.getElementById('matchs');
    matchsEquipe.forEach(m => {
      const lien = `feuille_equipe.html?id=${m.id}&equipe=${equipe}`;
      div.innerHTML += `
        <p>${m.date} - ${m.equipe1} vs ${m.equipe2}
        <a href="${lien}" target="_blank">🖨️ Feuille</a></p>
      `;
    });
  });
