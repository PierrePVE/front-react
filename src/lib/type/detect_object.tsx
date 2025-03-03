import React, { useState } from "react";

const DetectObject = () => {
  const [isOn, setIsOn] = useState(false);

  // Fonction de bascule pour inverser l'état de isOn
  const toggle = () => {
    setIsOn(!isOn);
  };

  return (
    <button onClick={toggle}>
      <span className={`material-symbols-rounded ${isOn ? "light-on" : ""}`}>
        add
      </span>
    </button>
  );
};

export default DetectObject;
