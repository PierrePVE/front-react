import React from "react";
import { FaThermometerHalf } from "react-icons/fa";

const Temperature = ({ value }) => {

  const temperature = value.values;

  const getTemperatureClass = () => {
    if (temperature <= 10) return "text-primary border-primary";
    if (temperature <= 25) return "text-success border-success";
    return "text-danger border-danger";
  };

  return (
    <div>
      <div className={`card text-center border-3 ${getTemperatureClass()}`}>
        <FaThermometerHalf className="display-4 mb-2" />
        <h5 className="card-title">Room Temperature</h5>
        <p className="card-text display-4 fw-bold text-black">{temperature}°C</p>
      </div>
    </div>
  );
};

export default Temperature;
