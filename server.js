const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret-futsal',
  resave: false,
  saveUninitialized: true
}));

// 📁 Données
const codes = require('./data/connexions.json');
const matchs = require('./data/matchs.json');

// Connexion
app.post('/login', (req, res) => {
  const { code } = req.body;
  const found = codes.find(e => e.code === code);
  if (found) {
    req.session.equipe = found.equipe;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Matchs
app.get('/mes-matchs', (req, res) => {
  if (!req.session.equipe) return res.status(401).json({ error: 'Non connecté' });
  const equipe = req.session.equipe;
  const matchsEquipe = matchs.filter(m => m.equipe1 === equipe || m.equipe2 === equipe);
  res.json({ equipe, matchs: matchsEquipe });
});

// Déconnexion
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.listen(3000, () => {
  console.log('Serveur en ligne sur http://localhost:3000');
});
