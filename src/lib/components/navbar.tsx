import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './navbar.css';  


const NavBar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" id="navbar-logo">
          EMBARQUE
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex justify-content-end w-100">
            <div id="date" className="text-white fs-4">
              {date.toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


