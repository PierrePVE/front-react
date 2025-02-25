import React from "react";
import "@style/Apropos.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Apropos = () => {
  return (
    <Container className="apropos-container">
      {/* Titre Principal */}
      <h1 className="apropos-title text-center">Welcome to DOMOTEEK</h1>
      <p className="text-center apropos-subtitle">
        Découvrez l'univers du projet de synthèse de troisième année de bachelor : embarqué, serveur, protocoles, trames, team building....
      </p>

      {/* Section Manuel d'utilisation */}
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">📖 Manuel d'Utilisation</h2>
              <p>
                Retrouvez toutes les informations essentielles pour l'installation et l'utilisation du projet
                dans notre wiki accessible depuis votre Moodle : <br /> 
                <a href="https://172.24.7.8/b3/synthese/embarque/-/wikis/home" className="apropos-link" target="_blank" rel="noopener noreferrer">
                  Manuel d'utilisation.
                </a>
              </p>
              {/* Ajout d'une image */}
              <img src="../src/assets/imgconnectee2.jpg" alt="Manuel d'Utilisation" className="d-block mx-auto" style={{ width: "80%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Objets connectés */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">🛠️ Liste des objets</h2>
              <ul>
                <li>Ampoule 12V</li>
                <li>Base Station</li>
                <li>Button</li>
                <li>Fall sensor</li>
                <li>Weather station Extern</li>
                <li>Ventilator</li>
              </ul>
              {/* Ajout d'une image */}
              <img src="../src/assets/maisonconnectee.jpg" alt="Objets connectés" className="d-block mx-auto" style={{ width: "100%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">📡 Protocoles</h2>
              <p>
                Découvrez la liste des protocoles propriétaires utilisés dans le projet, incluant :
              </p>
              <ul>
                <li><strong>SMMP</strong> : Un protocole de communication série léger et efficace pour l'échange d'informations entre la base et les objets connectés.</li>
                <li><strong>PIS</strong> : Un protocole qui définit un format commun pour l'échange de données entre les services du serveur, basé sur le format JSON et conçu pour être générique afin de répondre à la majorité des cas d'utilisation.</li>
              </ul>
              {/* Ajout d'une image */}
              <img src="../src/assets/domotique.jpg" alt="Protocoles" className="d-block mx-auto" style={{ width: "80%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Partie du projet */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">🌐 Server Side</h2>
              <p>
                Tout ce qui touche au développement backend, aux services hébergés sur le serveur et à leur configuration. Ici, on gère le côté logiciel, les outils et services qui permettent de faire fonctionner l'application en production. 
              </p>
              {/* Ajout d'une image */}
              <img src="path/to/your/image4.jpg" alt="Server Side" className="d-block mx-auto" style={{ width: "80%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">📟 Embarqué</h2>
              <p>
                Tout ce qui concerne la partie embarquée du projet :
              </p>
              <ul>
                <li>🔧 <strong>SMMP :</strong> Le protocole SMMP est utilisé pour la communication entre la base station et les objets connectés.</li>
                <li>🖥️ <strong>Software :</strong> Détails des éléments software communs à tous les objets sont disponibles.</li>
                <li>📡 <strong>Base Station :</strong> Routeur du réseau chargé de la communication entre les objets (en SMMP) et le serveur (en PIS). Elle s'occupe également de l'appairage des objets.</li>
                <li>🔧 <strong>Objects :</strong> Désigne l'ensemble des objets embarqués, répartis en deux catégories : Actionneurs et Capteurs.</li>
                <li>🔩 <strong>Actionneurs :</strong> Objets qui agissent sur l'environnement à la commande d'une automation ou d'un utilisateur.</li>
                <li>📊 <strong>Capteurs :</strong> Objets qui mesurent l'environnement et envoient les données à la base station.</li>
              </ul>
              {/* Ajout d'une image */}
              <img src="path/to/your/image5.jpg" alt="Embarqué" className="d-block mx-auto" style={{ width: "80%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section CI/CD */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="apropos-card">
            <Card.Body>
              <h2 className="apropos-heading">🚀 Intégration et Déploiement (CI/CD)</h2>
              <p>
                Découvrez comment le projet utilise un pipeline CI/CD performant pour automatiser les déploiements et garantir une mise en production efficace.
              </p>
              <p>
                Le **CDCI** automatise la compilation, les tests et le déploiement des applications, permettant la création d'exécutables Windows et Linux à chaque création de tag. Voici les étapes clés :
              </p>
              <ul>
                <li><strong>Commiter</strong> le code sur la branche <code>dev</code> et créer un nouveau tag : <code>git tag -a v1.4 -m "Description"</code></li>
                <li><strong>Jobs</strong> : Le pipeline se compose de 3 jobs principaux :
                  <ul>
                    <li><strong>build_front</strong> : Construction de l'application front-end.</li>
                    <li><strong>generate_linux</strong> & <strong>generate_windows</strong> : Génération des exécutables en parallèle pour chaque plateforme.</li>
                    <li><strong>release_job</strong> : Création d'une release avec les exécutables générés.</li>
                  </ul>
                </li>
                <li><strong>Automatisation</strong> : Chaque nouveau tag déclenche automatiquement le pipeline, créant une release avec les exécutables prêts à être téléchargés.</li>
              </ul>
              {/* Ajout d'une image */}
              <img src="path/to/your/image6.jpg" alt="CI/CD" className="d-block mx-auto" style={{ width: "80%", height: "auto" }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Apropos;
