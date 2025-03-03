import React from "react";
import { useState, useEffect } from "react";

const MeteoExt = ({ value }) => {

  const { params: { values: paramsValues } = {}, values: valuesFromParamId = [] } = value || {};

  const [meteoData, setMeteoData] = useState(value || {});  // Stocke la dernière valeur reçue

  useEffect(() => {
    // Mise en place de l'intervalle pour rafraîchir les données
    const intervalId = setInterval(async () => {
      try {
        // Ici, value devrait être mis à jour par le parent (via props), donc on peut simplement le stocker
        setMeteoData(value);
      } catch (error) {
        console.error("Erreur lors de la mise à jour météo :", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [valuesFromParamId, value]); // Déclenche un refresh si les valeurs changent

  // console.log("Value Meteo :", meteoData);

  // <div>
  //   <span className="material-symbols-rounded">sunnycloudrainythunderstorm</span>
  // </div>

  return (
    <div className="meteo-ext">
      <div className="temperature text-center mb-3">
        <h2 className="fw-bold">
          🌡️ {value.values[0].value}°C
        </h2>
      </div>

      {/* Informations météo */}
      <div className="row d-flex justify-content-between align-items-center text-center">
        <div className="col d-flex flex-column align-items-center">
          <span className="fs-3">💧</span>
          <p className="mb-1 fw-semibold">Humidity</p>
          <p className="mb-0">{value.values[0].value} %</p>
        </div>

        <div className="col d-flex flex-column align-items-center">
          <span className="fs-3">💨</span>
          <p className="mb-1 fw-semibold">Wind</p>
          <p className="mb-0">{value.values[0].value} km/h</p>
        </div>

        <div className="col d-flex flex-column align-items-center">
          <span className="fs-3">🌪️</span>
          <p className="mb-1 fw-semibold">Pressure</p>
          <p className="mb-0">{value.values[0].value} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default MeteoExt;
