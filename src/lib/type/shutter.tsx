import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icônes pour monter/descendre

const Shutter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      className={`btn btn-lg ${isOpen ? "btn-success" : "btn-secondary"}`}
      onClick={toggle}
    >
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}{" "}
      {isOpen ? "Open Shutter" : "Close Shutter"}
    </button>
  );
};

export default Shutter;
