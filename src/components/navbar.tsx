// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h2 className="logo">EcoBât</h2>
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/about" className="nav-link">À propos</Link>
          <Link to="/contact" className="nav-link">S'engager</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
