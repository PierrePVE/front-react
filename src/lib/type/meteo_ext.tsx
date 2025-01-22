import React from "react";

const MeteoExt = ({ value }) => {
  return (
    <div className="meteo-ext">
      <div>
        <span className="material-symbols-rounded">sunnycloudrainythunderstorm</span>
      </div>
      <div className="temperature">{value} 25°</div>
      <div>Humidity : {value} 30 %</div>
      <div>Wind : {value} 12 km/h</div>
      <div>Pressure: {value} 1018 Pa</div>
    </div>
  );
};

export default MeteoExt;
