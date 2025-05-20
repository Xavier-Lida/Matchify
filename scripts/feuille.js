const id = parseInt(new URLSearchParams(window.location.search).get("id"));

Promise.all([
  fetch('data/matchs.json').then(res => res.json()),
  fetch('data/joueurs.json').then(res => res.json())
]).then(([matchs, joueursData]) => {
  const match = matchs.find(m => m.id === 3);
  if (!match) return;

  const div = document.getElementById('feuille');

  const joueurs1 = joueursData[match.receveur] || [];
  const joueurs2 = joueursData[match.visiteur] || [];

  const listeJoueurs = (joueurs) => joueurs.map(j => `<li>${j}</li>`).join('');

  div.innerHTML = `
    <h2>${match.receveur} vs ${match.visiteur}</h2>
    <p>📅 ${match.date} à ${match.heure} — 📍 ${match.terrain}</p>
    <h3>${match.receveur}</h3>
    <ul>${listeJoueurs(joueurs1)}</ul>

    <h3>${match.visiteur}</h3>
    <ul>${listeJoueurs(joueurs2)}</ul>
  `;
});
