import React from 'react';
import './Navbar.css'; // Assurez-vous de mettre à jour le CSS aussi

function Navbar() {
  return (
    <>
      <div className="top-banner">
        VITE ! Trouver vos sweats préférés avec Snatched
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="brand-logo">
            <img src="pixelcut-export.png" alt="Snatched Logo" />
          </div>
          <ul className="nav-links">
            <li><a href="/produits" className="nav-link">Nos Produits</a></li>
          <div className="search-bar">
            <input type="text" placeholder="Recherche..." />
            <button>    </button>
          </div>
          <li><a href="/contact" className="nav-link">Contactez-nous</a></li>
          <li><a href="/login" className="nav-link login-link">Se connecter</a></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

