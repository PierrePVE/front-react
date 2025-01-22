import React, { useState } from "react";
import { API_URL } from "../main.tsx";
import SHA256 from 'crypto-js/sha256';

const UserList = ({ users, setUsers, setNewUser,  newUser, setError, token, fetchUsers }) => {
      
    const handleDeleteUser = async (id) => {
        const res =await fetch(`${API_URL}/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        });
        
        const { message } = await res.json();

        if (res.ok) {
        getUsers();
        location.reload();
        } else{
        setError(message);
        }
    };

    const getUsers = async () => {
        const res = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        });
        const data = await res.json();

        if (res.ok) {
        console.log("message")
        setUsers(data);
        } else{
        
        setError(data.message);
        }
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        const userToAdd = { ...newUser, password: SHA256(newUser.password).toString() };
        const res = await fetch(`${API_URL}/user`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userToAdd),
        });
        const { message } = await res.json();

        if (res.ok) {
            setNewUser({ name: "", email: "", password: "", admin: false });
            getUsers();
            location.reload();
        } else{
            setError(message);
        }
    
    };
  
    return (
      <div className="container mt-5">
        <h2 className="fs-3 mb-4">Gestion Utilisateurs</h2>
        
        {/* Liste des utilisateurs */}
        <div className="mb-4 p-4">
          {users && users.map((user) => (
            <div key={user.id} className="d-flex justify-content-between align-items-center mb-3">
              <p className="fs-5">{user.name}</p>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Ajouter un utilisateur */}
        <h3 className="fs-3">Ajouter un utilisateur</h3>
        <div className="p-4">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Nom"
            />
          </div>

          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
            />
          </div>

          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Mot de passe"
            />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-text">
              <input
                type="checkbox"
                id="admin"
                checked={newUser.admin}
                onChange={(e) => setNewUser({ ...newUser, admin: e.target.checked })}
              />
            </div>
            <input
              type="text"
              className="form-control"
              value={newUser.admin ? "Admin" : "Utilisateur"}
              disabled
            />
          </div>

          <button
            className="btn btn-primary w-100 mt-1 button-comp"
            onClick={handleAddUser}
          >
            Ajouter
          </button>
        </div>
      </div>
    );
  };
  
  export default UserList;
  