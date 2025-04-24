import React, { useState } from 'react';
import Navbar from '../components/navbar';
import '../styles/model.css';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const ModelPrediction: React.FC = () => {
  const [surface, setSurface] = useState('');
  const [annee, setAnnee] = useState('');
  const [geo, setGeo] = useState('');
  const [ges, setGes] = useState('');
  const [conso, setConso] = useState('');

  const [prediction, setPrediction] = useState('');
  const [confiance, setConfiance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPredicted, setHasPredicted] = useState(false);

  const toNum = (s: string) => parseFloat(s);

  const validate = (): boolean => {
    const s = toNum(surface);
    const a = toNum(annee);
    const g = toNum(geo);
    const e = toNum(ges);
    const c = toNum(conso);

    if (
      isNaN(s) || s <= 0 ||
      isNaN(a) || a < 1800 ||
      isNaN(g) || g < 0 || g > 100 ||
      isNaN(e) || e < 0 ||
      isNaN(c) || c <= 0
    ) {
      setError('Veuillez entrer des valeurs valides pour tous les champs');
      return false;
    }
    setError('');
    return true;
  };

  const getConseil = (classe: string) => {
    switch (classe) {
      case 'A': return "🏆 Excellente performance ! Continuez comme ça.";
      case 'B': return "💡 Très bon score. Une isolation renforcée pourrait viser la classe A.";
      case 'C': return "🔧 Correct, mais améliorable. Vérifiez l’isolation des murs et fenêtres.";
      case 'D': return "⚠️ Moyenne. Un audit énergétique vous aiderait à cibler les améliorations.";
      case 'E': return "🛠️ Faible efficacité. Pensez à améliorer le système de chauffage.";
      case 'F':
      case 'G': return "🔥 Très énergivore ! Une rénovation globale est fortement recommandée.";
      default: return "";
    }
  };

  const handlePrediction = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surface: toNum(surface),
          annee: toNum(annee),
          geo: toNum(geo),
          ges: toNum(ges),
          conso: toNum(conso),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erreur inconnue');
      } else {
        const data = await res.json();
        setPrediction(data.classe_predite);
        setConfiance(data.confiance);
        setHasPredicted(true); // switch to two-column view
      }
    } catch {
      setError('Erreur de communication avec le serveur');
    }
    setLoading(false);
  };

  const chartData = [{
    name: prediction,
    uv: Math.round(confiance * 100),
    fill: '#82ca9d',
  }];

  return (
    <>
      <Navbar />
      <div className={`prediction-container ${hasPredicted ? 'split-view' : 'center-form'}`}>
        <AnimatePresence>
          <motion.div
            key="form"
            className="form-container"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="prediction-title">
              Estimez la Classe Énergétique
            </h2>

            <div className="form-field">
              <label>Surface thermique (m²) :</label>
              <input type="number" value={surface} onChange={e => setSurface(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Année de construction :</label>
              <input type="number" value={annee} onChange={e => setAnnee(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Geo Score (0–100) :</label>
              <input type="number" value={geo} onChange={e => setGeo(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Estimation GES (kgCO₂/m²) :</label>
              <input type="number" value={ges} onChange={e => setGes(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Consommation énergétique (kWh) :</label>
              <input type="number" value={conso} onChange={e => setConso(e.target.value)} />
            </div>

            <button onClick={handlePrediction} disabled={loading}>
              {loading ? 'Chargement...' : 'Prédire la classe énergétique'}
            </button>

            {error && <div className="error-message">{error}</div>}
          </motion.div>

          {hasPredicted && (
            <motion.div
              key="result"
              className="result-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Classe prédite : {prediction}</h3>
              <p>Confiance : {Math.round(confiance * 100)} %</p>
              <p className="conseil">{getConseil(prediction)}</p>

              <div className="chart-wrapper" style={{ width: 300, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="80%" outerRadius="100%"
                    barSize={20}
                    data={chartData}
                  >
<RadialBar
  {...({
    minAngle: 15,
    clockWise: true,
    dataKey: 'uv',
    background: true
  } as any)}
/>
                    <Legend layout="vertical" verticalAlign="middle" align="center" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ModelPrediction;
