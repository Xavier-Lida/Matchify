const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Tes fichiers HTML/JS
app.use(session({
  secret: 'futsalSecret123',
  resave: false,
  saveUninitialized: true
}));

// Simuler des comptes
const codes = [
  { equipe: 'Shawinigan', code: 'shaw123' },
  { equipe: 'Nicolet', code: 'nico456' }
];

// Connexion
app.post('/login', (req, res) => {
  const { code } = req.body;
  const found = codes.find(c => c.code === code);
  if (found) {
    req.session.equipe = found.equipe;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Données sécurisées
app.get('/mes-matchs', (req, res) => {
  if (!req.session.equipe) return res.status(401).json({ error: 'Non connecté' });

  const matchs = require('./data/matchs.json');
  const matchsEquipe = matchs.filter(m =>
    m.equipe1 === req.session.equipe || m.equipe2 === req.session.equipe
  );
  res.json({ equipe: req.session.equipe, matchs: matchsEquipe });
});

// Déconnexion
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.listen(3000, () => console.log('Serveur sur http://localhost:3000'));
