import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import '../styles/hero.css';

const Home: React.FC = () => {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <h2 className="logo">EcoBât</h2>
          <div className="nav-links">
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/about" className="nav-link">À propos</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>
      <div className="hero">
        <h1 className="hero-title">Bienvenue sur <span className="highlight">EcoBât</span></h1>
        <p className="hero-subtitle">
          Explorez les bâtiments en 3D et découvrez leur impact environnemental.
        </p>
        <Link to="/map3d" className="explore-button">Explorer la carte</Link>
      </div>
    </>
  );
};

export default Home;