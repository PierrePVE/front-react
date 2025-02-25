import React, { useState } from "react";
import { postActuatorRequestApi } from "../../main.tsx";
import "@style/fan.css"

const Fan = ({ value }) => {
  // Utilisation de useState pour gérer l'état de l'activation et de la vitesse
  const [isOn, setIsOn] = useState(false);
  const [scale, setScale] = useState(0);
  const token = localStorage.getItem("token");

  // Fonction pour inverser l'état du ventilateur
  const toggle = async () => {
    setIsOn(!isOn);

    console.log("paramid : ",value.params.values[0]?.parameter_id)

    try {
      const res = await postActuatorRequestApi(
        token,
        value.object_id,
        value.params.values[0]?.parameter_id, // Vérifier si values existe avant d'accéder à param_id
        isOn ? "0" : "1"
      );
      console.log(res.status === 200 ? "Fan toggled successfully" : "Error");
    } catch (error) {
      console.error("Error sending fan state", error);
    }
  };

  // Fonction pour gérer la modification de la vitesse
  const handleScaleChange = (event) => {
    setScale(parseFloat(event.target.value));
  };

  // console.log("Value Fan : ", value)

  return (
    <div className="justify-content-center align-items-center text-center">
      <button className="btn-lg btn" onClick={toggle}>
        <span className={`material-symbols-rounded ${isOn ? "fan-on" : ""}`} style={{color: isOn ? "yellow": "white", fontSize: "60px"}}>
          mode_fan
        </span>
      </button>

      <div className="fan_info">
        <div>
          Fan Speed: {Math.round(((scale - 0.1) / (3 - 0.1)) * 100)}%
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
