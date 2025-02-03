import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import './navbar.css';  
import logo from '../assets/logodomoteek.png';

const NavBar = () => {
  const [date, setDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  // Met à jour la date chaque seconde
  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Gérer la taille de l'écran (changer menu selon la taille)
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ferme le menu lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" ref={navRef}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" id="navbar-logo">
          <img src={logo} alt="Logo Domoteek" style={{ height: '40px', marginRight: '10px' }} />
        </Link>

        <div className="icon-container">
          <i className="bi bi-hypnotize rotating-icon"></i>
        </div>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-cpu custom-icon-size"></i>
        </button>

        {/* Menu principal avec animation (en petit écran) */}
        <div
          className={`navbar-collapse ${isLargeScreen ? '' : menuOpen ? "show fade-in" : "fade-out"}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Apropos" onClick={() => setMenuOpen(false)}>À propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
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
