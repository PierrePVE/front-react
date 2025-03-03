import React from "react";
import "./ManuelUtilisation.css";

const ManuelUtilisation: React.FC = () => {
  return (
    <div className="manuel-container">
      <h1 className="manuel-title">Manuel d'Utilisation</h1>
      <p className="manuel-subtitle">Guide complet pour l'installation et l'utilisation</p>
      
      <section className="manuel-card">
        <h2 className="manuel-heading">Installation</h2>
        <p>
          Pour accéder aux dernières versions du projet, consultez notre dépôt
          GitLab. Si vous êtes en dehors du réseau Wi-Fi de l'ESEO, connectez-vous
          au VPN.
        </p>
        <h3>Cloner et installer</h3>
        <pre>
          <code>npm install</code>
        </pre>
        <h3>Base de données</h3>
        <pre>
          <code>
            python3 initDB.py
          </code>
        </pre>
      </section>

      <section className="manuel-card">
        <h2 className="manuel-heading">Configuration</h2>
        <p>
          Copiez les fichiers <code>.env.template</code> et renommez-les en
          <code>.env</code> pour configurer les variables d'environnement.
        </p>
      </section>

      <section className="manuel-card">
        <h2 className="manuel-heading">Utilisation</h2>
        <h3>Démarrer le projet</h3>
        <pre>
          <code>npm run dev</code>
        </pre>
        <h3>Lancer Compute et Link</h3>
        <pre>
          <code>python3 main.py</code>
        </pre>
      </section>

      <section className="manuel-card">
        <h2 className="manuel-heading">En Production</h2>
        <p>
          Téléchargez les fichiers depuis GitLab et exécutez-les. Pour Windows,
          lancez <code>Domoteek.exe</code>.
        </p>
      </section>

      <section className="manuel-card">
        <h2 className="manuel-heading">Manipuler le Front</h2>
        <p>
          Connectez-vous avec vos identifiants. Pour accéder à l'interface admin :
        </p>
        <pre>
          <code>ID : admin | MDP : aze</code>
        </pre>
        <p>
          Gérez les utilisateurs via "Account settings" et accédez à la page
          "A propos" pour plus d'informations.
        </p>
      </section>
    </div>
  );
};

export default ManuelUtilisation;
