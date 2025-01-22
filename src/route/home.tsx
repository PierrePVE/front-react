import React, { useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import { API_URL, getRequestApi, deleteRequestApi, postAutomationRequestApi, postRequestApi, putRequestApi } from "../main.tsx";
import Objects from "../lib/Objects.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

interface DataObject {
  object_id: string;
  room_id: string;
  values: any;
  params: any;
  friendly_name: any;
  type: any;
}

interface Automation {
  name: string;
}

interface Room {
  id: string;
  name: string;
}

const Home = () => {
  const [side, setSide] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState({
    name: localStorage.getItem('name') || "",
    password: ""
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [admin, setAdmin] = useState(localStorage.getItem('admin') === "true" ? true : false);
  const [allObjects, setAllObjects] = useState<DataObject[]>([]);  
  const [automations, setAutomations] = useState<Automation[]>([]);  
  const [values, setValues] = useState([]);
  const [params, setParams] = useState([]);
  const [rooms, setRooms] = useState<Room[]>([]);  
  const [autorisation, setAutorisation] = useState([]);
  const [allDataObjects, setAllDataObjects] = useState<DataObject[]>([]);
  const [colapseName, setColapseName] = useState(false);
  const [colapseAutomation, setColapseAutomation] = useState(false);
  const [colapseRoom, setColapseRoom] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [addAutomation, setAddAutomation] = useState(false);
  const [error, setError] = useState("");
  const [logError, setLogError] = useState("");
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger: {
      id_obj: "",
      param: "",
      cond: "",
      value: ""
    },
    action: {
      id_obj: "",
      param: "",
      active: "",
      disable: ""
    }
  });
  const [newRoom, setNewRoom] = useState("-1");
  const [friendlyName, setFriendlyName] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token != null) getAllData();

    // Check if the token is expired
    const lastTimestamp = localStorage.getItem("time");
    const currentTime = Date.now();
    let timeDifference = 0;
    if (lastTimestamp !== null) {
      timeDifference = currentTime - parseInt(lastTimestamp, 10);
    } else {
      console.error("lastTimestamp is null");
    }    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    if (timeDifference > oneHour) {
      localStorage.clear();
    }

    // Update the data every 5 seconds
    const intervalId = setInterval(async () => {
      if (token != null) {
        await getValueAndParams(allObjects);
        console.log("Updated");
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  // Toggle side panel
  const toggleSide = (id) => {
    setAddAutomation(false);
    setError("");
    if (selectedObject !== id && id !== null) {
      setSelectedObject(id);
      setSide(true);
    } else {
      setSelectedObject(null);
      setSide(false);
    }
  };

  // Toggle collapse for different sections
  const toggleColapseName = () => setColapseName(!colapseName);
  const toggleColapseAutomation = () => setColapseAutomation(!colapseAutomation);
  const toggleColapseRoom = () => setColapseRoom(!colapseRoom);

  const getData = async () => {
    return await getRequestApi(token, '/object/all/');
  };

  const getValuesFromId = async (obj) => {
    return await getRequestApi(token, `/object/valuebyid/${obj.object_id}`);
  };

  const getParamByType = async (obj) => {
    return await getRequestApi(token, `/object/objectparams/${obj.type}`);
  };

  const getAutomations = async () => {
    return await getRequestApi(token, '/automation/');
  };

  const getRooms = async () => {
    return await getRequestApi(token, '/user/room/');
  };

  const getAutorisation = async () => {
    return await getRequestApi(token, `/user/authorisation/${user.name}`);
  };

  const getValueAndParams = async (objs) => {
    for (const obj of objs) {
      const values = await getValuesFromId(obj);
      const params = await getParamByType(obj);
      const rooms = await getRooms();
      const autorisation = await getAutorisation();

      const index = allDataObjects.findIndex(x => x.object_id === obj.object_id);
      if (index !== -1) {
        setAllDataObjects((prev) => {
          const newData = [...prev];
          newData[index] = { ...obj, values, params };
          return newData;
        });
      } else {
        setAllDataObjects((prev) => [...prev, { ...obj, values, params }]);
      }
    }
  };

  const getAllData = async () => {
    setDataLoaded(false);
    const objects = await getData();
    setAllObjects(objects);
    await getValueAndParams(objects);
    const automations = await getAutomations();
    setAutomations(automations);
    setDataLoaded(true);
  };

  const toggleUserDropdown = () => setUserDropdown(!userDropdown);

  const handleBackToLogin = () => setShowForm(false);

  const handleDeleteAutomation = async (name) => {
    await deleteRequestApi(token, `/automation/${name}`);
    setAutomations(automations.filter(automation => automation.name !== name));
  };

  const handleAddAutomation = () => {
    setAddAutomation(!addAutomation);
    setNewAutomation({
      name: "",
      trigger: {
        id_obj: selectedObject || "",
        param: "",
        cond: "",
        value: ""
      },
      action: {
        id_obj: "",
        param: "",
        active: "",
        disable: ""
      }
    });
  };

  const areAllFieldsFilled = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (!areAllFieldsFilled(obj[key])) {
          return false;
        }
      } else if (obj[key] === "") {
        return false;
      }
    }
    return true;
  };

  const AddAutomation = async () => {
    const isFilled = areAllFieldsFilled(newAutomation);
    if (isFilled) {
      setAutomations([...automations, newAutomation]);
      const error = await postAutomationRequestApi(token, newAutomation);
      setError(error);
      setAddAutomation(false);
    } else {
      setError("All fields must be filled");
    }
  };

  const handleLogin = async () => {
    if (user.name !== "" && user.password !== "") {
     // console.log("user : " + user.name + " password : " + user.password)
      user.password = SHA256(user.password).toString();
      //console.log("token : " + token)
      const { response, status } = await postRequestApi(token, '/user/login', user);
      console.log("réponse : ", response);
      if (status === 200) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("name", user.name);
        localStorage.setItem("admin", response.admin);
        localStorage.setItem("time", Date.now().toString());
        setUserDropdown(false);
        location.reload();
      } else {
        setUser({ name: "", password: "" });
        setLogError("Wrong username or password");
      }
    }
    
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('admin');
    setUserDropdown(true);
    location.reload();
  };

  const handleEditRoom = async () => {
    if (newRoom === "-1") {
      alert("Veuillez remplir tous les champs");
      return;
    }
    const data = await putRequestApi(token, "/user/room", { room_id: newRoom, object_id: selectedObject });
    setNewRoom("-1");
    location.reload();
  };

  const getRoomNameById = (room_id) => {
    return rooms.find(room => room.id === room_id)?.name;
  };

  const handleEditFriendlyname = async () => {
    if (friendlyName === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }
    const data = await putRequestApi(token, "/object/changeFriendlyname", { objectId: selectedObject, value: friendlyName });
    setFriendlyName("");
    location.reload();
  };

  return (
        <>
          <div className="container d-flex flex-column justify-content-center align-items-center text-center">

            {/* User/Login Section */}
            <div id="user">
              {!token ? (
                // Si le token n'est pas présent, afficher le bouton "Login"
                <div
                  id="loginSection"
                  className="d-flex mt-5 flex-column justify-content-center align-items-center text-center"
                  style={{
                    fontSize: "1.2rem", // Augmenter la taille de la police pour tout
                    width: "100%",      // Largeur à 100% pour permettre au contenu de s'étendre
                    padding: "30px",    // Espacement interne pour rendre la zone plus grande
                  }}
                >
                  <h2 className="fs-1 mb-4">Connect</h2> {/* Augmenter la taille du titre */}
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
                    className="btn btn-outline-danger mt-3 d-flex align-items-center gap-2"
                    onClick={handleLogin}
                    style={{
                      fontSize: "1.0rem",   // Augmenter la taille du texte du bouton
                      padding: "12px 20px", // Augmenter la taille du bouton
                    }}
                  >
                    Connect
                  </button>
                </div>
              ) : (
                // Si le token est présent, afficher les informations de l'utilisateur connecté
                <div id="connectedSection" className="d-flex flex-column justify-content-center align-items-center text-center py-4 px-3 shadow-sm rounded bg-light">
                  <h2 className="fs-1 mb-4" style={{ fontFamily: "Roboto, sans-serif", color: "#333" }}>Welcome {user.name} !</h2>
                  <a href="/user" className="btn btn-link mb-3 text-decoration-none text-primary fs-5 hover-shadow">
                    <span className="material-symbols-rounded me-2">settings</span> Account Settings
                  </a>
                  <button
                    className="btn btn-outline-danger d-flex align-items-center gap-2 py-2 px-4 fs-5"
                    onClick={handleLogout}
                  >
                    <span className="material-symbols-rounded">logout</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
            <main>
                {!token ? (
                    <p>Vous devez être connecté pour accéder à cette page</p>
                ) : (
                    !dataLoaded ? (
                        <p>Chargement...</p>
                    ) : (
                        rooms.map((room) => (
                            <div className="roomBox" key={room.id}>
                                <h1>{room.name}</h1>
                                <div>
                                    {allDataObjects.map((object) =>
                                        object.room_id === room.id ? (
                                            <Objects
                                                key={object.object_id}
                                                toggleSettings={toggleSide}
                                                size="1x1"
                                                value={object}
                                                autorisation={autorisation}
                                                admin={admin}
                                            />
                                        ) : null
                                    )}
                                </div>
                            </div>
                        ))
                    )
                )}
            </main>
            {side && (
                <div>
                    <div id="header">
                        <h1>Settings</h1>
                        <button name="close" onClick={toggleSide}>
                            <span className="material-symbols-rounded">close</span>
                        </button>
                    </div>

                    {/* Collapse Menus */}
                    <div className="colapseMenu">
                        <button className="colapseBtn" onClick={toggleColapseName}>
                            <h2>Names</h2>
                            <span className="material-symbols-rounded">
                                {colapseName ? "expand_less" : "expand_more"}
                            </span>
                        </button>
                        {colapseName && (
                            <div>
                                {allObjects.map((object) =>
                                    object.object_id === selectedObject ? (
                                        <div key={object.object_id} className="objectSetting">
                                            <h2>{object.friendly_name}</h2>
                                            <p>Type : {object.type}</p>
                                            <div className="input">
                                                <input
                                                    type="text"
                                                    value={friendlyName}
                                                    onChange={(e) => setFriendlyName(e.target.value)}
                                                    placeholder="Friendly name"
                                                />
                                                <button
                                                    className="custom_button center"
                                                    onClick={handleEditFriendlyname}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;