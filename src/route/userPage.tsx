import React, { useEffect, useState } from "react";
import { API_URL } from "../main.jsx";
import Header from "@components/Header";
import UserList from "@components/UserList";
import RoomList from "@components/RoomList";
import AuthorizationList from "@components/AuthorizationList";
import EditPassword from "@components/EditPassword";
import { getRequestApi } from "../API_request.js";

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
      window.location.href = "/Login";
    }

    if (admin) {
      getUsers();
      getRooms();
      getAutorisations();
    }

    // Update the data every 5 seconds
    const intervalId = setInterval(async () => {
      setToken(localStorage.getItem('token'));
      if (token == null){
        location.replace('/Login');
      }
    }, 1000);   
  }, [token, admin]);

  const getUsers = async () => {
    try{
      const data =await getRequestApi(token, `/user`);
      console.log("message")
      setUsers(data);
      return data;
    } catch (error){
      seterror(error);
    }
  };

  const getRooms = async () => {
      try{
        const data =await getRequestApi(token, `/user/room/`);
        setRooms(data);
        return data
      } catch (error){
        seterror(error);
      }
    };

  const getAutorisations = async () => {
    try{
        const data = await getRequestApi(token, `/user/authorisation`);
        setAutorisations(data);
        return data
      } catch (error){
        seterror(error);
      }
    };

  const fetchUsers = async () => {
    const data = await getUsers();
    data.ok ? setUsers(data) : seterror(data.message);
  };

  const fetchRooms = async () => {
    const data = await getRooms();
    data.ok ? setRooms(data) : seterror(data.message);
    
  };

  const fetchAuthorizations = async () => {
    
    const data = await getAutorisations();

    data.ok ? setAutorisations(data) : seterror(data.message);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        seterror(""); 
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, [error]);

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
      {error && <p className="text-danger" style={{ fontSize: "1.3rem", border: "1px solid", padding : "10px",left : "50%", borderRadius: "10px",   position: "fixed", bottom:"0", transform: "translateX(-50%)"}}>{error}</p>}
    </div>
  );
};

export default UserPage;
