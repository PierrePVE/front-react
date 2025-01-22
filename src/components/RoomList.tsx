import React, { useState } from "react";
import { API_URL } from "../main.tsx";


const RoomList = ({ rooms, setRooms, getRooms, newRoom, setNewRoom, seterror, token, fetchRooms }) => {

    const handleAddRoom = async () => {
        if (!newRoom) {
            alert("Veuillez remplir le champ");
            return;
        }
        const res = await fetch(`${API_URL}/user/room`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newRoom }),
        });

        const { message } = await res.json();

        if (res.ok) {
            setNewRoom("");
            getRooms();
            location.reload();
        } else{
            setNewRoom("");
            seterror(message);
        }
    };

    const handleDeleteRoom = async (id) => {
        const res = await fetch(`${API_URL}/user/room/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        const { message } = await res.json();

        if (res.ok) {
            getRooms();
            location.reload();
        } else{
            seterror(message);
        }
    };

  return (
    <div className="container mt-1">
        <h2 className="fs-3 mb-4">Gestion Rooms</h2>

        {/* Liste des Rooms */}
        <div>
            {rooms.map((room) => (
            <div key={room.id} className="d-flex justify-content-between align-items-center mb-3">
                <p className="fs-5">{room.name}</p>
                {room.id !== 0 && (
                <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteRoom(room.id)}
                >
                    Supprimer
                </button>
                )}
            </div>
            ))}
        </div>

        {/* Ajouter une Room */}
        <div className="mt-5">
            <h3 className="fs-3 mb-4">Ajouter une Room</h3>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="room"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Nom de la Room"
                />
                <button
                    className="btn button-comp"
                    onClick={handleAddRoom}
                >
                    Ajouter
                </button>
                </div>
        </div>
    </div>
  );
};

export default RoomList;
