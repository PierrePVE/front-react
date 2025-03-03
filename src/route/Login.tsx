import React, { useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import { API_URL } from "../main.tsx";
import {getRequestApi, deleteRequestApi, postAutomationRequestApi, postRequestApi, putRequestApi} from "../API_request.tsx"
import Objects from "../lib/Objects.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Led from "../lib/type/led.tsx"
import '@style/home.css'
const Login = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState({
        name: localStorage.getItem('name') || "",
        password: ""
    });
    const [logError, setLogError] = useState("");
    const handleLogin = async () => {
        if (user.name !== "" && user.password !== "") {
         // console.log("user : " + user.name + " password : " + user.password)
          user.password = SHA256(user.password).toString(); // A enlever pour décrypter autrement !
          //console.log("token : " + token)
          const { response, status } = await postRequestApi(token, '/user/login', user);
          console.log("réponse : ", response);
          if (status === 200) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("name", user.name);
            localStorage.setItem("admin", response.admin);
            localStorage.setItem("time", Date.now().toString());
            setUserDropdown(false);
            location.replace('/');
          } else {
            setUser({ name: "", password: "" });
            setLogError("Wrong username or password");
          }
        }
        
      };
return (
    <div id="user">
                <div
                  id="loginSection"
                  className="d-flex mt-5 flex-column justify-content-center align-items-center text-center"
                  style={{
                    fontSize: "1.2rem", // Augmenter la taille de la police pour tout
                    width: "100%",      // Largeur à 100% pour permettre au contenu de s'étendre
                    padding: "30px",    // Espacement interne pour rendre la zone plus grande
                  }}
                >
                  <h2 className="fs-1 mb-4 ">Connect</h2> {/* Augmenter la taille du titre */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      placeholder="Username"
                      style={{ fontSize: "1.2rem", padding: "10px" }}  // Augmenter la taille du texte et de l'input
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      placeholder="Password"
                      style={{ fontSize: "1.2rem", padding: "10px" }}  // Augmenter la taille du texte et de l'input
                    />
                  </div>
                  {logError && <p className="text-danger" style={{ fontSize: "1.1rem" }}>{logError}</p>} {/* Augmenter la taille du texte d'erreur */}
                  <button
                className="btn btn-outline-danger mt-3 d-flex align-items-center gap-2 btn-with-glow-effect"
                onClick={handleLogin}
                style={{
                    fontSize: "1.0rem",   // Augmenter la taille du texte du bouton
                    padding: "12px 20px", // Augmenter la taille du bouton
                }}
                >
                Connect
                </button>


            </div>
        </div>
    );
};
                
export default Login;