import React, { useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import { API_URL, getRequestApi, deleteRequestApi, postAutomationRequestApi, postRequestApi, putRequestApi } from "../main.tsx";
import Objects from "../lib/Objects.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Led from "../lib/type/led.tsx"
import '../route/home.css'

interface DataObject {
  object_id: string;
  room_id: string;
  values: any;
  params: any;
  friendly_name: any;
  type: any;
}

interface Param {
  parameter_id: string;
  name: string;
  type: string;
}

interface Trigger {
  id_obj: string;
  param: string;
  cond: string;
  value: string;
}

interface Action {
  id_obj: string;
  param: string;
  active: string;
  disable: string;
}

interface Automation {
  name: string;
  trigger: Trigger;
  action: Action;
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
        const objects = await getData(); // Récupère toujours les derniers objets
        setAllObjects(objects); // Met à jour allObjects pour éviter qu'il soit vide
        await getValueAndParams(objects);
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
      console.log("selectedObject open : ", selectedObject)
      console.log("idObject open : ", id)
      setSelectedObject(id);
      setSide(true);
    } else {
      console.log("selectedObject close : ", selectedObject)
      console.log("idObject close : ", id)
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
     
    const room =await getRequestApi(token, '/user/room/');
    

    return room
  };

  const getAutorisation = async () => {
    return await getRequestApi(token, `/user/authorisation/${user.name}`);
  };

  const getValueAndParams = async (objs) => {
    const newDataObjects = [...allDataObjects];

    for (const obj of objs) {
        const values = await getValuesFromId(obj);
        const params = await getParamByType(obj);
        
        setRooms(await getRooms());
        const autorisation = await getAutorisation();

        const index = newDataObjects.findIndex(x => x.object_id === obj.object_id);
        if (index !== -1) {
            newDataObjects[index] = { ...obj, values, params };
        } else {
            newDataObjects.push({ ...obj, values, params });
        }
    }

    setAllDataObjects(newDataObjects);
};

  const getAllData = async () => {
    setDataLoaded(false);
    const objects = await getData();
    setAllObjects(objects);
    console.log(objects)
    
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

  useEffect(() => {
      console.log(allDataObjects);
  }, [allDataObjects]);

  return (
        <>
          <div className="container2 d-flex flex-column justify-content-center align-items-center text-center">

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
                <div id="connectedSection" className="d-flex flex-column justify-content-center align-items-center text-center py-4 px-3 shadow-sm rounded mt-2">
                  <h2 className="fs-1 mb-4 fw-bold" style={{ fontFamily: "Roboto, sans-serif", color: "#333" }}>Welcome {user.name} !</h2>
                  <a href="/user" className="btn btn-link mb-3 text-decoration-none text-primary fs-5 hover-shadow">
                    <span className="material-symbols-rounded me-2 align-middle">settings</span> Account Settings
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
                    <div key={room.id} className="mb-4 roomCard p-4 mt-5">
                      <h1 className="text-center fw-bold fs-1">{room.name}</h1>
                        <div className="d-flex flex-wrap">
                          {allDataObjects
                            .filter((object) => object.room_id === room.id)
                            .map((object) => (
                              <div className="roomBox m-2 p-3" key={object.object_id}>
                                <Objects
                                  toggleSettings={toggleSide}
                                  size="1x1"
                                  value={object}
                                  autorisation={autorisation}
                                  admin={admin}
                                />
                              </div>
                            ))}
                        </div>
                    </div>
                  ))
                )
              )}
            </main>
            {/* partie pour afficher les paramètre d'un objet a controller*/}
            {side && (
              <div className="modal show d-block" tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header justify-content-center">
                      <h5 className="modal-title text-center fw-bold fs-1">Settings </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => toggleSide(null)} // Ferme la modale
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {/* Contenu de la modale */}
                      <div>
                        <div className="colapseMenu">
                          {/* Colapse Name */}
                          {/* Bouton pour ouvrir le form pour ajouter un nom à l'objet */}
                          <button
                            className="btn btn-primary w-100 mb-2"
                            onClick={toggleColapseName}
                          >
                            <h6 className="d-inline text-white">Names</h6>
                            <span className="float-end material-symbols-rounded text-white">
                              {colapseName ? "expand_less" : "expand_more"}
                            </span>
                          </button>
                           {/* Formulaire pour changer le nom de l'objet */}
                          {colapseName && (
                            <div>
                              {allObjects
                                .filter(object => object.object_id === selectedObject)
                                .map((object) => (
                                  <div key={object.object_id} className="border p-3 mb-3">
                                    <h6 className="fw-bold text-center fs-5">{object.friendly_name}</h6>
                                    <p>Type : {object.type}</p>
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={friendlyName}
                                        onChange={(e) => setFriendlyName(e.target.value)}
                                        placeholder="Friendly name"
                                      />
                                      <div className="input-group-append">
                                        <button className="btn btn-success d-flex align-items-center" onClick={handleEditFriendlyname}>
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                          {/* Colapse Room */}
                          {/* Bouton pour ouvrir le form pour modifier la room affecté à l'objet */}
                          <button
                            className="btn btn-primary w-100 mb-2"
                            onClick={toggleColapseRoom}
                          >
                            <h6 className="d-inline text-white">Rooms</h6>
                            <span className="float-end material-symbols-rounded text-white">
                              {colapseRoom ? "expand_less" : "expand_more"}
                            </span>
                          </button>
                          {/* Formulaire pour affecter la room */}
                          <div className={colapseRoom ? "collapse show" : "collapse"}>
                            {allObjects.map((object) =>
                              object.object_id === selectedObject ? (
                                <div key={object.object_id} className="objectSetting p-3 mb-3 border">
                                  <h6 className="fw-bold text-center fs-5">{object.friendly_name}</h6>
                                  <p>Room : {getRoomNameById(object.room_id)}</p>
                                  <div className="input-group">
                                    <select
                                      value={newRoom}
                                      onChange={(e) => setNewRoom(e.target.value)}
                                      className="form-control"
                                    >
                                      <option value="-1" disabled>
                                        -- Select --
                                      </option>
                                      {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                          {room.name}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="input-group-append">
                                      <button
                                        className="btn btn-success d-flex align-items-center"
                                        onClick={handleEditRoom}
                                      >
                                        Edit Room
                                      </button>
                                      </div>
                                    </div>
                                </div>
                              ) : null
                            )}
                          </div>
                          {/* colapseAutomation */}
                          {/* Bouton pour ouvrir le form pour ajouter un automation à l'objet */}
                          <button
                            className="btn btn-primary w-100 mb-2"
                            onClick={toggleColapseAutomation}
                          >
                            <h6 className="d-inline text-white">Automations</h6>
                            <span className="float-end material-symbols-rounded text-white">
                              {colapseAutomation ? "expand_less" : "expand_more"}
                            </span>
                          </button>
                          {/* Affichage de Automation */}
                          <div className={colapseAutomation ? "collapse show" : "collapse"}>
                            {automations.map((automation) =>
                              automation.trigger.id_obj === selectedObject ? (
                                <div key={automation.name} className="card mb-3 shadow-sm">
                                  <div className="card-header d-flex justify-content-between bg-primary align-items-center">
                                    <h5 className="mb-0 fw-bold text-white">{automation.name}</h5>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDeleteAutomation(automation.name)}
                                    >
                                      <span className="material-symbols-rounded">delete</span>
                                    </button>
                                  </div>

                                  <div className="card-body">
                                    {/* Trigger Section */}
                                    <div className="mb-3">
                                      <h6 className="fw-bold fs-5 text-center">Trigger</h6>
                                      <ul className="list-group list-group-flush">
                                        <li className="list-group-item">ID Objet : {automation.trigger.id_obj}</li>
                                        {allDataObjects.map((object) =>
                                          object.object_id === automation.trigger.id_obj ? (
                                            object.params.values.map((param) =>
                                              param.parameter_id === automation.trigger.param ? (
                                                <li key={param.parameter_id} className="list-group-item">
                                                  Paramètre: {param.name}
                                                </li>
                                              ) : null
                                            )
                                          ) : null
                                        )}
                                        <li className="list-group-item">Condition : {automation.trigger.cond}</li>
                                        <li className="list-group-item">Valeur : {automation.trigger.value}</li>
                                      </ul>
                                    </div>

                                    {/* Action Section */}
                                    <div>
                                      <h6 className="fw-bold fs-5 text-center">Action</h6>
                                      <ul className="list-group list-group-flush">
                                        <li className="list-group-item">ID Objet : {automation.action.id_obj}</li>
                                        {allDataObjects.map((object) =>
                                          object.object_id === automation.action.id_obj ? (
                                            object.params.values.map((param) =>
                                              param.parameter_id === automation.action.param ? (
                                                <li key={param.parameter_id} className="list-group-item">
                                                  Paramètre : {param.name}
                                                </li>
                                              ) : null
                                            )
                                          ) : null
                                        )}
                                        <li className="list-group-item">Active : {automation.action.active.toString()}</li>
                                        <li className="list-group-item">Désactivé : {automation.action.disable.toString()}</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ) : null
                            )}

                            {/* Formulaire d'ajout de l'automation */}
                            {addAutomation ? (
                              <div className="card shadow-sm border border-primary">
                                <div className="card-header bg-primary text-white">
                                  <h4 className="mb-0 text-center fs-2 fw-bold">New Automation</h4>
                                </div>
                                <div>
                                  <table className="table">
                                    <tbody>
                                      <tr>
                                        <td className="align-middle">Name</td>
                                        <td>
                                          <input
                                            type="text"
                                            name="name"
                                            value={newAutomation.name}
                                            onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                                            className="form-control"
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={2} className="fw-bold text-center fs-5">
                                          Trigger
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">Parametre</td>
                                        <td>
                                          <select
                                            name="param_in"
                                            value={newAutomation.trigger.param}
                                            onChange={(e) => setNewAutomation({ ...newAutomation, trigger: { ...newAutomation.trigger, param: e.target.value } })}
                                            className="form-control"
                                          >
                                            <option value="" disabled>
                                              -- Select one --
                                            </option>
                                            {allDataObjects.map((object) =>
                                              object.object_id === selectedObject
                                                ? object.params.values.map((param) => (
                                                    <option key={param.parameter_id} value={param.parameter_id}>
                                                      {param.name}
                                                    </option>
                                                  ))
                                                : null
                                            )}
                                          </select>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">Condition</td>
                                        <td>
                                          {allDataObjects.map((object) =>
                                            object.object_id === selectedObject
                                              ? object.params.values.map((param) =>
                                                  param.parameter_id === newAutomation.trigger.param ? (
                                                    <select
                                                      key={param.parameter_id}
                                                      name="cond_in"
                                                      value={newAutomation.trigger.cond}
                                                      onChange={(e) => setNewAutomation({ ...newAutomation, trigger: { ...newAutomation.trigger, cond: e.target.value } })}
                                                      className="form-control"
                                                    >
                                                      <option value="" disabled>
                                                        -- Select one --
                                                      </option>
                                                      {param.type === "bool" ? (
                                                        <>
                                                          <option value="=">=</option>
                                                          <option value="toggle">toggle</option>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <option value="=">=</option>
                                                          <option value=">">&gt;</option>
                                                          <option value="<">&lt;</option>
                                                        </>
                                                      )}
                                                    </select>
                                                  ) : null
                                                )
                                              : null
                                          )}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">Valeur</td>
                                        <td>
                                          {allDataObjects.map((object) =>
                                            object.object_id === selectedObject
                                              ? object.params.values.map((param) =>
                                                  param.parameter_id === newAutomation.trigger.param ? (
                                                    param.type === "bool" ? (
                                                      <select
                                                        key={param.parameter_id}
                                                        name="value_in"
                                                        value={newAutomation.trigger.value}
                                                        onChange={(e) => setNewAutomation({ ...newAutomation, trigger: { ...newAutomation.trigger, value: e.target.value } })}
                                                        className="form-control"
                                                      >
                                                        <option value="" disabled>
                                                          -- Select one --
                                                        </option>
                                                        <option value="1">true</option>
                                                        <option value="0">false</option>
                                                      </select>
                                                    ) : param.type === "int" ? (
                                                      <input
                                                        type="number"
                                                        name="value_in"
                                                        value={newAutomation.trigger.value}
                                                        onChange={(e) => setNewAutomation({ ...newAutomation, trigger: { ...newAutomation.trigger, value: e.target.value } })}
                                                        className="form-control"
                                                      />
                                                    ) : (
                                                      <input
                                                        type="text"
                                                        name="value_in"
                                                        value={newAutomation.trigger.value}
                                                        onChange={(e) => setNewAutomation({ ...newAutomation, trigger: { ...newAutomation.trigger, value: e.target.value } })}
                                                        className="form-control"
                                                      />
                                                    )
                                                  ) : null
                                                )
                                              : null
                                          )}
                                        </td>
                                      </tr>
                                      {/* Deuxième partis */}
                                      <tr>
                                        <td colSpan={2} className="fw-bold text-center fs-5">
                                          Action
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">Object</td>
                                        <td>
                                          <select name="id_obj" className="form-control" value={newAutomation.action.id_obj} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, id_obj: e.target.value } })}>
                                            <option value="" disabled>-- Select one --</option>
                                            {allDataObjects.map((object) => (
                                              <option key={object.object_id} value={object.object_id}>
                                                {object.friendly_name} ({object.type})
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">Parametre</td>
                                        <td>
                                          <select name="param_in" className="form-control" value={newAutomation.action.param} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, param: e.target.value } })}>
                                            <option value="" disabled>-- Select one --</option>
                                            {allDataObjects.map((object) =>
                                              object.object_id === newAutomation.action.id_obj &&
                                              object.params.values.map((param) => (
                                                <option key={param.parameter_id} value={param.parameter_id}>
                                                  {param.name}
                                                </option>
                                              ))
                                            )}
                                          </select>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">True</td>
                                        <td>
                                          {allDataObjects.map((object) =>
                                            object.object_id === newAutomation.action.id_obj &&
                                            object.params.values.map((param) =>
                                              param.parameter_id === newAutomation.action.param && (
                                                param.type === "bool" ? (
                                                  <select name="active_in" value={newAutomation.action.active} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, active: e.target.value } })}>
                                                    <option value="" disabled>-- Select one --</option>
                                                    <option value="1">true</option>
                                                    <option value="0">false</option>
                                                  </select>
                                                ) : param.type === "int" ? (
                                                  <input type="number" name="active_in" value={newAutomation.action.active} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, active: e.target.value } })} />
                                                ) : (
                                                  <input type="text" name="active_in" value={newAutomation.action.active} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, active: e.target.value } })} />
                                                )
                                              )
                                            )
                                          )}
                                          <input type="text" disabled className="disableElement" />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="align-middle">False</td>
                                        <td>
                                          {allDataObjects.map((object) =>
                                            object.object_id === newAutomation.action.id_obj &&
                                            object.params.values.map((param) =>
                                              param.parameter_id === newAutomation.action.param && (
                                                param.type === "bool" ? (
                                                  <select name="disable_in" value={newAutomation.action.disable} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, disable: e.target.value } })}>
                                                    <option value="" disabled>-- Select one --</option>
                                                    <option value="1">true</option>
                                                    <option value="0">false</option>
                                                  </select>
                                                ) : param.type === "int" ? (
                                                  <input type="number" name="disable_in" value={newAutomation.action.disable} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, disable: e.target.value } })} />
                                                ) : (
                                                  <input type="text" name="disable_in" value={newAutomation.action.disable} onChange={(e) => setNewAutomation({ ...newAutomation, action: { ...newAutomation.action, disable: e.target.value } })} />
                                                )
                                              )
                                            )
                                          )}
                                          <input type="text" disabled className="disableElement" />
                                        </td>
                                      </tr>

                                      <tr>
                                        <td colSpan={2} className="text-center">
                                          <button className="btn btn-success" onClick={AddAutomation}>
                                            Add automation
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-center">
                                <button className="btn btn-info text-white" onClick={handleAddAutomation}>
                                  Add automation
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => toggleSide(null)} // Ferme la modale
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}

export default Home;