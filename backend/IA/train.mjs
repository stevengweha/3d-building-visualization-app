import mysql from 'mysql2';
import { NeuralNetwork } from 'brain.js';
import fs from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

// Connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dpe_france'
});

// Fonction pour calculer le min et max d'un tableau
const minMax = (arr) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return { min, max };
};

// Créer un modèle NeuralNetwork avec 3 couches cachées de 15, 10 et 5 neurones
const net = new NeuralNetwork({ hiddenLayers: [2, 3, 5] });

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données✅');
});

connection.query('SELECT * FROM batiments', (err, rows) => {
  if (err) {
    console.log('Erreur de récupération des données', err);
    return;
  }

  // Calcul des min et max pour normaliser les données
  const surfaceMinMax = minMax(rows.map(row => row.surface_thermique_lot));
  const anneeMinMax = minMax(rows.map(row => row.annee_construction));
  const geoMinMax = minMax(rows.map(row => row.geo_score));
  const gesMinMax = minMax(rows.map(row => row.estimation_ges));
  const consoMinMax = minMax(rows.map(row => row.consommation_energie));

  // Fonction de normalisation
  const normalize = (value, min, max) => (value - min) / (max - min);

  // Création des données d'entraînement
  const trainingData = rows.map(row => {
    const classe = String(row.classe_consommation_energie).trim().toUpperCase();
    return {
      input: {
        surface: normalize(row.surface_thermique_lot, surfaceMinMax.min, surfaceMinMax.max),
        annee: normalize(row.annee_construction, anneeMinMax.min, anneeMinMax.max),
        geo: normalize(row.geo_score, geoMinMax.min, geoMinMax.max),
        ges: normalize(row.estimation_ges, gesMinMax.min, gesMinMax.max),
        conso: normalize(row.consommation_energie, consoMinMax.min, consoMinMax.max)
      },
      output: { [classe]: 1 }
    };
  });

  // Séparation des données en entraînement et test (80% / 20%)
  const trainSize = Math.floor(trainingData.length * 0.8);
  const trainData = trainingData.slice(0, trainSize);
  const testData = trainingData.slice(trainSize);

  // Paramètres d'entraînement optimisés
  const errorHistory = [];
  
  // Entraînement avec un taux d'apprentissage plus faible, momentum et plus d'itérations
  net.train(trainData, {
    iterations: 30000,
    errorThresh: 0.002,
    learningRate: 0.01, // Un taux d'apprentissage plus faible pour éviter l'overfitting
    momentum: 0.9,       // Aide à accélérer la convergence
    log: (error) => {
      errorHistory.push(error);
    },
  });

  console.log('Entraînement terminé !✅');

  // Sauvegarde du modèle
  const trainedModelJSON = net.toJSON();
  fs.writeFileSync('model.json', JSON.stringify(trainedModelJSON));
  console.log('Modèle sauvegardé dans model.json✅');

  // Validation avec des données de test
  let correctPredictions = 0;
  let totalPredictions = testData.length;

  testData.forEach(data => {
    const output = net.run(data.input);
    const predictedClass = Object.keys(output).reduce((a, b) => output[a] > output[b] ? a : b);
    const realClass = Object.keys(data.output).find(key => data.output[key] === 1);

    if (predictedClass === realClass) {
      correctPredictions++;
    }
  });

  const accuracy = (correctPredictions / totalPredictions) * 100;
  console.log(`Précision du modèle sur les données de test : ${accuracy.toFixed(2)}%😇`);

  // Affichage de la matrice de confusion
  const confusionMatrix = getConfusionMatrix(testData);
  console.log('Matrice de confusion:', confusionMatrix);

  // Tracer les courbes d'erreur
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const configuration = {
    type: 'line',
    data: {
      labels: Array.from({ length: errorHistory.length }, (_, i) => i + 1),
      datasets: [{
        label: 'Erreur de l\'entraînement',
        data: errorHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Itérations' } },
        y: { title: { display: true, text: 'Erreur' } }
      }
    }
  };

  chartJSNodeCanvas.renderToBuffer(configuration)
    .then(buffer => {
      fs.writeFileSync('training_error_curve.png', buffer);
      console.log('Courbe d\'erreur enregistrée sous "training_error_curve.png"👍');
    })
    .catch(err => {
      console.error('Erreur lors de la création de la courbe :', err);
    });

  connection.end();
});

// Fonction pour obtenir la matrice de confusion
function getConfusionMatrix(testData) {
  const matrix = {};

  testData.forEach(data => {
    const output = net.run(data.input);
    const predictedClass = Object.keys(output).reduce((a, b) => output[a] > output[b] ? a : b);
    const realClass = Object.keys(data.output).find(key => data.output[key] === 1);

    if (!matrix[realClass]) matrix[realClass] = {};
    if (!matrix[realClass][predictedClass]) matrix[realClass][predictedClass] = 0;

    matrix[realClass][predictedClass]++;
  });

  return matrix;
}

