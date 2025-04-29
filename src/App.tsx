import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Map3D from './components/Map3D';
import ModelPrediction from './components/ModelPrediction';
import Login from './components/login';
import Register from './components/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map3d" element={<Map3D />} />
        <Route path="/ModelPrediction" element={<ModelPrediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;