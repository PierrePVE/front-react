import React, { useState } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import './Header.css';

const Header = ({ name }) => (
  <div className="d-flex justify-content-between align-items-center p-3">
    <a href="/" className="text-dark fs-4">
      <FaArrowLeft />
    </a>
    <span className="fs-4 fw-bold text-dark mx-auto h3">{name}</span>
  </div>
  );
  
  export default Header;