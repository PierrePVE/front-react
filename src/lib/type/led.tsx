import React, { useState, useEffect } from "react";
import { postActuatorRequestApi } from "../../main.tsx"; // Assurez-vous que cette fonction est bien définie dans le bon fichier.

const Led = ({ value }) => {
  // Initialisation de l'état pour le bouton, l'état initial et l'état de la dernière valeur
  const [isOn, setIsOn] = useState(value.values[0].value === "0" ? true : false);
  const [lastState, setLastState] = useState(value.values[0].value);
  const token = localStorage.getItem("token");

  // Fonction pour basculer l'état du bouton et envoyer la requête API
  const toggle = async () => {
    setIsOn(!isOn);

    try {
      const res = await postActuatorRequestApi(
        token,
        value.object_id,
        value.values[0].param_id,
        isOn ? "0" : "1"
      );
      // Gérez la réponse du serveur si nécessaire
      // console.log(res.status === 200 ? "Success" : "Error", value.object_id, value.values[0].param_id, isOn ? "0" : "1");
    } catch (error) {
      console.error("Error sending data", error);
    }
  };

  // Gestion de l'intervalle pour vérifier l'état à intervalles réguliers
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (lastState !== value.values[0].value) {
        setLastState(value.values[0].value);
        setIsOn(value.values[0].value === "0" ? true : false);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastState, value.values]);

  return (
    <div>
      <button onClick={toggle} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
        <span
          className="material-symbols-rounded"
          style={{ color: isOn ? "yellow" : "#c890d0", fontSize: "90px" }}
        >
          lightbulb
        </span>
      </button>
    </div>
  );
};

export default Led;
