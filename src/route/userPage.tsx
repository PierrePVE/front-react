import React, { useEffect, useState } from "react";
import { API_URL } from "../main.jsx";
import Header from "@components/Header";
import UserList from "@components/UserList";
import RoomList from "@components/RoomList";
import AuthorizationList from "@components/AuthorizationList";
import EditPassword from "@components/EditPassword";

interface Users {
  id: any;
  name: string;
}

interface Room {
  id: number;
  name: string;
}

interface Autorisation {
  user_name: any,
  room_name: any,
  role: any,
  id:any
}

const UserPage = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [admin, setAdmin] = useState(localStorage.getItem("admin") === "true");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [autorisations, setAutorisations] = useState<Autorisation[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", admin: false });
  const [newAutorisation, setNewAutorisation] = useState({ user_id: "", room_id: "", role: "user" });
  const [password, setPassword] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [error, seterror] = useState("");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }

    if (admin) {
      getUsers();
      getRooms();
      getAutorisations();
    }
  }, [token, admin]);

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
      
      seterror(data.message);
    }
  };

  const getRooms = async () => {
    const res = await fetch(`${API_URL}/user/room`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setRooms(data);
    } else{
      seterror(data.message);
    }
  };

  const getAutorisations = async () => {
    const res = await fetch(`${API_URL}/user/authorisation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setAutorisations(data);
    } else{
      seterror(data.message);
    }
    
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    res.ok ? setUsers(data) : seterror(data.message);
  };

  const fetchRooms = async () => {
    const res = await fetch(`${API_URL}/user/room`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    res.ok ? setRooms(data) : seterror(data.message);
  };

  const fetchAuthorizations = async () => {
    const res = await fetch(`${API_URL}/user/authorisation`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    res.ok ? setAutorisations(data) : seterror(data.message);
  };

  return (
    <div>
      <Header name={name} />
      <main>
        <EditPassword name={name} token={token} setError={seterror} />
        {admin && (
          <>
            <UserList users={users} setError={seterror} setNewUser={setNewUser} setUsers={setUsers} token={token} newUser={newUser} fetchUsers={fetchUsers} />
            <RoomList rooms={rooms} setRooms={setRooms} getRooms={getRooms} newRoom={newRoom} setNewRoom={setNewRoom} seterror={seterror} token={token} fetchRooms={fetchRooms} />
            <AuthorizationList
              autorisations={autorisations} 
              setAutorisations={setAutorisations}
              getAutorisations={getAutorisations} 
              users={users} 
              rooms={rooms} 
              seterror={seterror} 
              newAutorisation={newAutorisation} 
              setNewAutorisation={setNewAutorisation} 
              token={token}
              fetchAuthorizations={fetchAuthorizations}
            />
          </>
        )}
      </main>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserPage;
