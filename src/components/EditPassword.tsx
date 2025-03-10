import React, { useState } from "react";
import SHA256 from 'crypto-js/sha256';
import { API_URL, postRequestApi} from "../main.tsx";

const EditPassword = ({ name, token, setError }) => {
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState({
  //     name: localStorage.getItem('name') || "",
  //     password: ""
  // });

  const handleEditPassword = async () => {
    if (!password) return alert("Veuillez remplir le champ");

    const hashedPassword = SHA256(password).toString();
    const res = await fetch(`${API_URL}/user/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: hashedPassword, name }),
    });

    const data = await res.json();
    if(res.ok){ 
      alert("Mot de passe modifié")
      handleLogout();
    }  
    else 
      setError(data.message);
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('admin');
    location.reload();
  };

  return (
  <div className="container mt-5">
    <h2 className="fs-3 mb-4">Edit Password</h2>
    <div>
      <div className="input-group">
        <input
          type="password"
          className="form-control"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-primary button-comp"
          onClick={handleEditPassword}
        >
          Edit
        </button>
      </div>
    </div>
  </div>
  );
};

export default EditPassword;
