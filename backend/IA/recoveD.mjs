// server.mjs
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { createPool } from 'mysql2/promise';
import { NeuralNetwork } from 'brain.js';

const app = express();
const PORT = 5001;

// --- 1) Chargement du modèle Brain.js ---
const modelJSON = JSON.parse(fs.readFileSync('model.json', 'utf8'));
const net = new NeuralNetwork();
net.fromJSON(modelJSON);

// --- 2) Connexion à MySQL (pool) ---
const pool = createPool({
  host:     'localhost',
  user:     'root',
  password: '',
  database: 'dpe_france',
  waitForConnections: true,
  connectionLimit: 10,
});console.log('Connecté à la base de données MySQL✅');
// --- 2.1) Vérification de la connexion (optionnel) ---

// --- 3) Normalization ranges (mêmes bornes que pour l'entraînement) ---
const normalizationRanges = {
  surface: { min: 10,   max: 2000 },
  annee:   { min: 1800, max: 2025 },
  geo:     { min: 0,    max:   100 },
  ges:     { min: 0,    max:   100 },
  conso:   { min: 0,    max: 10000 },
};
const normalize = (v, { min, max }) => (v - min) / (max - min);

// --- 4) Middlewares ---
app.use(cors());
app.use(express.json());

// --- 5) Endpoint de prédiction -- POST /predict ---
app.post('/predict', async (req, res) => {
  const { surface, annee, geo, ges, conso } = req.body;

  // 5.1) Validation minimale
  if ([surface, annee, geo, ges, conso].some(x => x === undefined)) {
    return res.status(400).json({ error: 'Champs manquants : surface, annee, geo, ges, conso' });
  }

  // 5.2) Normalisation
  const input = {
    surface: normalize(surface, normalizationRanges.surface),
    annee:   normalize(annee,   normalizationRanges.annee),
    geo:     normalize(geo,     normalizationRanges.geo),
    ges:     normalize(ges,     normalizationRanges.ges),
    conso:   normalize(conso,   normalizationRanges.conso),
  };

  // 5.3) Calcul de la prédiction
  const output = net.run(input);
  const predictedClass = Object.keys(output)
    .reduce((a, b) => output[a] > output[b] ? a : b);
  const confidence = output[predictedClass];

  // 5.4) Enregistrer la requête + résultat en base
  try {
    await pool.execute(
      `INSERT INTO predictions 
        (surface_thermique_lot, annee_construction, geo_score, estimation_ges, consommation_energie, classe_predite, confiance, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [surface, annee, geo, ges, conso, predictedClass, confidence]
    );
  } catch (dbErr) {
    console.error('Erreur insertion prediction:', dbErr);
    // on continue quand même, ne pas bloquer la réponse
  }

  // 5.5) Renvoi au client
  res.json({ classe_predite: predictedClass, confiance: confidence });
});

// --- 6) Démarrage ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur de prédiction et d'enregistrement démarré sur http://localhost:${PORT}`);
});
