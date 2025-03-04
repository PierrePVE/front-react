import React, { useState, useEffect } from "react";
import { postActuatorRequestApi } from "../../API_request.tsx";
import "@style/fan.css"

const Fan = ({ value }) => {
  const [isOn, setIsOn] = useState(false);
  const [scale, setScale] = useState(0);
  const token = localStorage.getItem("token");
  const [debouncedScale, setDebouncedScale] = useState(0); // État pour limiter les requêtes

  // Fonction pour inverser l'état du ventilateur
  const toggle = async () => {
    setIsOn(!isOn);

    console.log("paramid : ", value.params.values[0]?.parameter_id)

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

  // Met à jour scale immédiatement sans envoyer la requête
  const handleScaleChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setScale(value);
    console.log("nombre : ", value, " du type : ", typeof value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedScale(scale);
    }, 500); // Attendre 500ms avant de mettre à jour `debouncedScale`

    return () => clearTimeout(timeout); // Annuler le timeout si scale change trop vite
  }, [scale]);

  useEffect(() => {
    if (debouncedScale !== null) {
      const changeSpeedFan = async () => {
        // console.log("je charge la donnée !!!")
        try {
          const res = await postActuatorRequestApi(
            token,
            value.object_id,
            value.params.values[1]?.parameter_id,
            debouncedScale.toString()
          );
          console.log(res.status === 200 ? "Fan speed updated successfully" : "Error");
        } catch (error) {
          console.error("Error sending fan state", error);
        }
      };

      changeSpeedFan();
    }
  }, [debouncedScale]);

  //console.log("Value Fan : ", value)

  return (
    <div className="justify-content-center align-items-center text-center">
      <button className="btn-lg btn" onClick={toggle}>
        <span className={`material-symbols-rounded ${isOn ? "fan-on" : ""}`} style={{ color: isOn ? "yellow" : "white", fontSize: "60px" }}>
          mode_fan
        </span>
      </button>

      <div className="fan_info">
        <div>
          Fan Speed: {Math.round((scale / 1000) * 100)}%
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={scale}
            onChange={handleScaleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Fan;
