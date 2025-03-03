import React from "react";
import Led from "@lib/type/led.tsx";
import Button from "@lib/type/button.tsx";
import Fan from "@lib/type/fan.tsx";
import TempInt from "@lib/type/temp_int.tsx";
import Shutter from "@lib/type/shutter.tsx";
import MeteoExt from "@lib/type/meteo_ext.tsx";
import DetectObject from "@lib/type/detect_object.tsx";
import '@style/Objects.css';  

const components = {
    led: Led,
    button: Button,
    fan: Fan,
    temp_int: TempInt,
    shutter: Shutter,
    meteo_ext: MeteoExt,
    detect_object: DetectObject,
    ampoule12v: Led, // Pas de problème avec la virgule ici
  };

const ObjectComponent = ({ value, toggleSettings, size, autorisation, admin }) => {
  // Trouver le composant à utiliser
  const Component = components[value.type];
  if (!Component) {
    throw new Error(`Le type ${value.type} n'est pas reconnu`);
  }

  // Calcul de la taille
  const [width, height] = size.split("x").map(Number);

  return (
    <div
      id="object"
      style={{
        width: `calc(15em * ${width})`,
        height: `calc(15em * ${height})`,
        gridColumn: `span ${width}`,
        gridRow: `span ${height}`,
      }}
    >
      <div id="header">
        <h1>{value.friendly_name}</h1>
        {admin ? (
          <button
            className="settings"
            onClick={() => toggleSettings(value.object_id)}
          >
            <span className="material-symbols-rounded">settings</span>
          </button>
        ) : (
          autorisation.map((autoris) =>
            autoris.room_id === value.room_id && autoris.role === "admin" ? (
              <button
                key={autoris.room_id}
                className="settings"
                onClick={() => toggleSettings(value.object_id)}
              >
                <span className="material-symbols-rounded">settings</span>
              </button>
            ) : null
          )
        )}
      </div>
      <div id="comp">
        <Component value={value} />
      </div>
    </div>
  );
};

export default ObjectComponent;