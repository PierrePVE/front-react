import React from "react";

const Temperature = ({ value }) => {
  return (
    <div>
      <p>The temperature in this room is :</p>
      <div>{value}°</div>
    </div>
  );
};

export default Temperature;
