import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home: React.FC = () => {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <h2 className="logo">EcoBât</h2>
          <div className="nav-links">
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/about" className="nav-link">À propos</Link>
            <Link to="/login" className="nav-link">S'engager</Link>
          </div>
        </div>
      </nav>

      <div className="hero-background">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Bienvenue sur <span className="highlight">EcoBât</span></h1>
            <p className="hero-subtitle">Découvrez les performances énergétiques des bâtiments autour de vous</p>
            <div className="hero-buttons">
              <Link to="/map3d" className="explore-button-carte">Explorer la carte</Link>
              <Link to="/ModelPrediction" className="explore-button-conso">Estimer ma consommation</Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 EcoBât. Tous droits réservés.</p>
      </footer>
    </>
  );
};

export default Home;
