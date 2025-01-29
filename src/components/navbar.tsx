import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './navbar.css';  
import logo from '../assets/logodomoteek.png';



const NavBar = () => {
  const [date, setDate] = useState(new Date());

  // Met à jour la date chaque seconde
  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" id="navbar-logo">
          <img src={logo} alt="Logo Domoteek" style={{ height: '40px', marginRight: '10px' }} />
        </Link>

        {/* Bouton burger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu principal */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
          {/* Date affichée à droite */}
          <div className="d-flex align-items-center text-white ms-lg-3">
            <span>{date.toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
