import React, { useEffect, useState } from "react";

const Button = ({ value }) => {
  // Décomposez les propriétés de l'objet "value"
  const { params: { values: paramsValues } = {}, values: valuesFromParamId = [] } = value || {};

  // Créez un objet pour stocker les dates des mises à jour
  const [dateFromParamId, setDateFromParamId] = useState({});

  useEffect(() => {
    // Initialisez les dates à partir de "valuesFromParamId"
    const initialDateMap = {};
    valuesFromParamId.forEach((value) => {
      initialDateMap[value.param_id] = value.date_updated;
    });
    setDateFromParamId(initialDateMap);

    // Met en place l'intervalle pour une mise à jour régulière
    const intervalId = setInterval(async () => {
      // Logique de mise à jour (remplacez ce commentaire par votre code)
      console.log("Update logic can be added here");
    }, 1000);

    // Nettoyage à la fin
    return () => {
      clearInterval(intervalId);
    };
  }, [valuesFromParamId]); // Dépendance pour exécuter ce hook quand les valeurs changent

  // console.log("Params Values Button : ", paramsValues)

  return (
    <div id="container">
      {paramsValues &&
        paramsValues.map((params) => (
          <div
            key={params.parameter_id}
            style={{ width: "250px" }}
          >
            <h5 className="fw-bold text-white">▶️ {params.name}</h5>
            <p className="text-white small">
              ⏳ Last press : {dateFromParamId[params.parameter_id] || "N/A"}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Button;
