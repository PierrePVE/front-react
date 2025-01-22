import React, { useState } from "react";
import { API_URL } from "../main.tsx";


const AuthorizationList = ({ autorisations, setAutorisations, getAutorisations, users, rooms, seterror, newAutorisation, setNewAutorisation, token, fetchAuthorizations }) => {

    const handleDeleteAutorisation = async (id) => {
        const res = await fetch(`${API_URL}/user/authorisation/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        });

        const { message } = await res.json();

        if (res.ok) {
        getAutorisations();
        location.reload();
        } else{
        seterror(message);
        }
        
    };

    const handleAddAutorisation = async () => {
        if (!newAutorisation.user_id || !newAutorisation.room_id || !newAutorisation.role) {
        alert("Veuillez remplir tous les champs");
        return;
        }
        const res = await fetch(`${API_URL}/user/authorisation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAutorisation),
        });

        const { message } = await res.json();

        if (res.ok) {
        setNewAutorisation({ user_id: "", room_id: "", role: "user" });
        getAutorisations();
        location.reload();
        } else{
        setNewAutorisation({ user_id: "", room_id: "", role: "user" });
        seterror(message);
        }
        
    };
  
    return (
    <div className="container mt-2">        
        <h2 className="fs-3 mb-4">Gestion Autorisation</h2>

        {/* Liste des autorisations */}
        <div className="mb-4 p-4">
        {autorisations.map((autorisation) => (
            <div className="d-flex justify-content-between align-items-center mb-3" key={autorisation.id}>
            <div>
                <p className="fs-5 mb-1"><strong>User:</strong> {autorisation.user_name}</p>
                <p className="fs-5 mb-1"><strong>Room:</strong> {autorisation.room_name}</p>
                <p className="fs-5 mb-1"><strong>Role:</strong> {autorisation.role}</p>
            </div>
            <button
                className="btn btn-outline-danger"
                onClick={() => handleDeleteAutorisation(autorisation.id)}
            >
                <span className="material-symbols-rounded">delete</span>
            </button>
            </div>
        ))}
        <div className="add userBox d-flex align-items-center gap-3">
            <div className="form-group d-flex align-items-center">
                <label htmlFor="user" className="form-label me-2">
                User:
                </label>
                <select
                id="user"
                className="form-select"
                value={newAutorisation.user_id}
                onChange={(e) =>
                    setNewAutorisation({
                    ...newAutorisation,
                    user_id: e.target.value,
                    })
                }
                >
                <option value="" disabled>
                    -- Select --
                </option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="form-group d-flex align-items-center">
                <label htmlFor="room" className="form-label me-2">
                Room:
                </label>
                <select
                id="room"
                className="form-select"
                value={newAutorisation.room_id}
                onChange={(e) =>
                    setNewAutorisation({
                    ...newAutorisation,
                    room_id: e.target.value,
                    })
                }
                >
                <option value="" disabled>
                    -- Select --
                </option>
                {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                    {room.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="form-group d-flex align-items-center">
                <label htmlFor="role" className="form-label me-2">
                Role:
                </label>
                <select
                id="role"
                className="form-select"
                value={newAutorisation.role}
                onChange={(e) =>
                    setNewAutorisation({
                    ...newAutorisation,
                    role: e.target.value,
                    })
                }
                >
                <option value="" disabled>
                    -- Select --
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                </select>
            </div>

            <button
                className="btn button-comp"
                onClick={handleAddAutorisation}
                style={{ marginLeft: '10px' }}
            >
                Ajouter
            </button>
            </div>
        </div>
      </div>
    );
  };
  
  export default AuthorizationList;
  