const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  user: 'votre_utilisateur',
  host: 'localhost',
  database: 'votre_base_de_donnees',
  password: 'votre_mot_de_passe',
  port: 5432,
});

// Middleware pour parser le JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Backend opérationnel !');
});

// Exemple de route pour récupérer des bâtiments
app.get('/buildings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM buildings');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});