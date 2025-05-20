fetch('data/joueurs.json')
  .then(res => res.json())
  .then(joueursData => {
    const container = document.getElementById('equipes');
    Object.entries(joueursData).forEach(([equipe, joueurs]) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = equipe;
      details.appendChild(summary);

      const ul = document.createElement('ul');
      joueurs.forEach(joueur => {
        const li = document.createElement('li');
        li.textContent = joueur;
        ul.appendChild(li);
      });

      details.appendChild(ul);
      container.appendChild(details);
    });
  });
