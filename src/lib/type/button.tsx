import React, { useEffect, useState } from "react";
import ButtonCompo from "../../components/buttonCompo.tsx";

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

  return (
    <div id="container">
      {paramsValues &&
        paramsValues.map((params) => (
          <div className="bloc" key={params.parameter_id}>
            <h3>{params.name}</h3>
            <p>Last Update: {dateFromParamId[params.parameter_id] || "N/A"}</p>
            {/* Utilisez ButtonCompo pour styliser vos boutons */}
            <ButtonCompo onClick={() => console.log(`Clicked on ${params.name}`)}>
              {`Action for ${params.name}`}
            </ButtonCompo>
          </div>
        ))}
    </div>
  );
};

export default Button;
