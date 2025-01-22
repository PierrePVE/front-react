import React, { useState } from "react";

const Fan = ({ value }) => {
  // Utilisation de useState pour gérer l'état de l'activation et de la vitesse
  const [isOn, setIsOn] = useState(false);
  const [scale, setScale] = useState(0);

  // Fonction pour inverser l'état du ventilateur
  const toggle = () => {
    setIsOn(!isOn);
  };

  // Fonction pour gérer la modification de la vitesse
  const handleScaleChange = (event) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <div>
      <button onClick={toggle}>
        <span className={`material-symbols-rounded ${isOn ? "fan-on" : ""}`}>
          mode_fan
        </span>
      </button>

      <div className="fan_info">
        <div>
          Fan Speed: {value} {Math.round(((scale - 0.1) / (3 - 0.1)) * 100)}%
        </div>
        <div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleScaleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Fan;
