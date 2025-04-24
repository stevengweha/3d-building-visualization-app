import mysql from 'mysql2/promise';

// Configuration de la connexion à MySQL
const dbConfig = {
  host: 'localhost',  // Adresse de ton serveur MySQL
  user: 'root',       // Nom d'utilisateur MySQL
  password: '',       // Mot de passe (vide pour XAMPP)
  port: 3306,         // Port par défaut pour MySQL
};

const initDB = async () => {
  const connection = await mysql.createConnection(dbConfig);

  // Créer la base de données si elle n'existe pas
  await connection.query('CREATE DATABASE IF NOT EXISTS dpe_france');
  await connection.query('USE dpe_france');

  // Créer la table 'batiments' si elle n'existe pas
  await connection.query(`
    CREATE TABLE IF NOT EXISTS batiments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      consommation_energie FLOAT,
      classe_consommation_energie VARCHAR(10),
      estimation_ges FLOAT,
      classe_estimation_ges VARCHAR(10),
      surface_thermique_lot FLOAT,
      annee_construction INT,
      date_etablissement_dpe DATE,
      tr001_modele_dpe_type_libelle VARCHAR(255),
      geo_score FLOAT,
      longitude FLOAT,
      latitude FLOAT
    )
  `);

  console.log('✅ Base de données et table créées avec succès.');

  // Fermer la connexion après la création
  await connection.end();
};

// Démarrer l'initialisation
initDB().catch((err) => {
  console.error('Erreur lors de la configuration de la base de données:', err);
});
