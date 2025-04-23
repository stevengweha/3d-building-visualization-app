import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Map3D from './components/Map3D';
import ModelPrediction from './components/ModelPrediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map3d" element={<Map3D />} />
        <Route path="/ModelPrediction" element={<ModelPrediction />} />

      </Routes>
    </Router>
  );
}

export default App;