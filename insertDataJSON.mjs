
//ce script permet d'inserer des donnees sous format geojson dans une base de donnees mysql


import fs from 'fs';
import path from 'path';
import mysql from 'mysql2';

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',    // Adresse de ton serveur MySQL (localhost ou une autre adresse)
  user: 'root',         // Nom d'utilisateur MySQL
  password: '',         // Mot de passe (vide par défaut pour XAMPP)
  database: 'dpe_france', // Nom de ta base de données
});

// Fonction pour insérer les données dans la base de données
const insertData = (data) => {
  data.forEach((feature) => {
    const { properties, geometry } = feature;

    // Assurez-vous que la géométrie et les propriétés existent
    if (geometry && geometry.coordinates && properties) {
      const [longitude, latitude] = geometry.coordinates;

      const {
        consommation_energie,
        classe_consommation_energie,
        estimation_ges,
        classe_estimation_ges,
        surface_thermique_lot,
        annee_construction,
        date_etablissement_dpe,
        tr001_modele_dpe_type_libelle,
        geo_score,
      } = properties;

      // Remplacer les valeurs undefined par null dans la requête
      const query = `
        INSERT INTO batiments (
          consommation_energie,
          classe_consommation_energie,
          estimation_ges,
          classe_estimation_ges,
          surface_thermique_lot,
          annee_construction,
          date_etablissement_dpe,
          tr001_modele_dpe_type_libelle,
          geo_score,
          longitude,
          latitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        consommation_energie || null,
        classe_consommation_energie || null,
        estimation_ges || null,
        classe_estimation_ges || null,
        surface_thermique_lot || null,
        annee_construction || null,
        date_etablissement_dpe || null,
        tr001_modele_dpe_type_libelle || null,
        geo_score || null,
        longitude,
        latitude,
      ];

      connection.execute(query, values, (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion:', err);
        } else {
          console.log('Données insérées avec succès:', results);
        }
      });
    }
  });
};

// Obtenir le chemin absolu du fichier actuel (utilisation de import.meta.url)
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Charger et lire le fichier GeoJSON
const geojsonPath = path.join( 'data', 'dpe-france.geojson');
fs.readFile(geojsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier GeoJSON:', err);
  } else {
    const geojson = JSON.parse(data);

    // Insérer les données dans la base de données
    insertData(geojson.features);

    // Fermer la connexion après les insertions
    connection.end();
  }
});



