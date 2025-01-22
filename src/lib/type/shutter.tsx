import React, { useState } from "react";

const Shutter = () => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(!isOn);
  };

  return (
    <button onClick={toggle}>
      <span className={`material-symbols-rounded ${isOn ? "light-on" : ""}`}>
        blinds
      </span>
    </button>
  );
};

export default Shutter;
 