// Script d’insertion de données CSV dans MySQL
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import csv from 'csv-parser';

// Chemin relatif
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dpe_france',
});

// Fonction d’insertion dans la base
const insertRow = (row) => {
  const query = `
    INSERT INTO batiments (
      id,
      type_batiment,
      consommation_energie,
      classe_conso,
      estimation_ges,
      classe_ges,
      surface_thermique,
      annee_construction,
      date_dpe,
      modele_dpe,
      geo_score,
      longitude,
      latitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    row['id'] || null,
    row['tr002_type_batiment_description'] || null,
    row['consommation_energie'] || null,
    row['classe_consommation_energie'] || null,
    row['estimation_ges'] || null,
    row['classe_estimation_ges'] || null,
    row['surface_thermique_lot'] || null,
    row['annee_construction'] || null,
    (row['date_etablissement_dpe'] || '').substring(0, 10) || null,
    row['tr001_modele_dpe_type_libelle'] || null,
    row['geo_score'] || null,
    row['longitude'] || null,
    row['latitude'] || null,
  ];

  connection.execute(query, values, (err) => {
    if (err) {
      console.error('Erreur insertion ligne :', err);
    }
  });
};

// Lecture du fichier CSV
const csvPath = path.join(__dirname, 'data', 'dpe-france.csv'); // <- mets le nom correct ici

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    insertRow(row);
  })
  .on('end', () => {
    console.log('CSV importé dans la base ✅');
    connection.end();
  })
  .on('error', (err) => {
    console.error('Erreur lecture CSV:', err);
  });
