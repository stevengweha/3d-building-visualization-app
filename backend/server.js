const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connecté à MySQL avec XAMPP");
});

// Route pour obtenir les bâtiments avec filtrage par classe énergétique
app.get('/api/batiments', (req, res) => {
  const { classe_consommation_energie } = req.query;  // Récupérer la classe depuis la requête
  let query = 'SELECT * FROM batiments';

  if (classe_consommation_energie) {
    // Si une ou plusieurs classes sont spécifiées, on ajoute le filtrage dans la requête SQL
    const classesArray = classe_consommation_energie.split(',').map(c => `'${c}'`).join(', ');
    query += ` WHERE classe_consommation_energie IN (${classesArray})`;
  }

  db.query(query, (err, results) => {
    if (err) throw err;

    // Convertir les résultats en GeoJSON
    const geojson = {
      type: "FeatureCollection",
      features: results.map(row => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [row.longitude, row.latitude]
        },
        properties: { ...row }
      }))
    };

    res.json(geojson);  // Retourner le GeoJSON
  });
});


// Route pour l'authentification
const authRoutes = require('./routes/auth'); // 🔁 chemin vers auth.js
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend tournant sur http://localhost:${PORT}`);
});
// GET /api/batiments/classes
app.get('/api/batiments/classes', (req, res) => {
  const sql = `
    SELECT DISTINCT TRIM(UPPER(classe_consommation_energie)) AS classe
    FROM batiments
    WHERE classe_consommation_energie IS NOT NULL
    ORDER BY classe
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur base' });
    // Retourne un simple tableau de chaînes ["A","B","C",...]
    res.json(results.map(r => r.classe));
  });
});
