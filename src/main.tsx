import React from 'react';
import ReactDOM from 'react-dom/client';
import "@style/app.css";
import '@style/main.css';
import App from './App.tsx'

// L'URL de l'API
export const API_URL = 'http://localhost:3000/api';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Send a POST request to the API to change the value of a parameter
 * @param {string} objectId - The id of the object
 * @param {string} paramId - The id of the parameter
 * @param {integer} value - The new value of the parameter
 * @returns {json} The response of the API
 */
export async function postActuatorRequestApi(token, objectId, paramId, value) {

  console.log("token : ", token)
  console.log("objectId : ", objectId)
  console.log("paramId : ", paramId)
  console.log("value : ", value)

  const response = await fetch(API_URL + '/actuator/change', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      "objectId": objectId,
      "paramId": paramId,
      "value": value
    })
  });

  return await response.json();
}

/**
 * Send a POST request to the API to add a new automation
 * @param {json} data - The data of the new automation
 * @returns {json} The response of the API
 */
export async function postAutomationRequestApi(token, data) {
  const response = await fetch(API_URL + '/automation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

/**
 * Send a POST request to the API
 * @param {string} route - The route of the API
 * @param {json} data - The data of the request
 * @returns {json} The response of the API
 */
export async function postRequestApi(token, route, data): Promise<any> {
  //console.log("postRequestApi : ", token, route, data);
  console.log("URL : ",API_URL + route)
  const response = await fetch(API_URL + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  console.log("responsedata :",responseData);

  // Retourner l'objet avec les données et le statut HTTP
  return {
    response: responseData,  // Le corps de la réponse JSON
    status: response.status  // Le statut HTTP
  };
}

/**
 * Send a GET request to the API
 * @params {string} route - The route of the API
 * @params {string} param - The parameter of the request
 * @returns {json} The response of the API
 */
export async function getRequestApi(token, route, param = '') {
  const response = await fetch(API_URL + route + param, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });
  return await response.json();
}

/**
 * Send a DELETE request to the API
 * @params {string} route - The route of the API
 * @params {string} param - The parameter of the request
 * @returns {json} The response of the API
 */
export async function deleteRequestApi(token, route, param = '') {
  const response = await fetch(API_URL + route + param, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });
  return await response.json();
}

/**
 * Send a PUT request to the API
 * @param {string} route - The route of the API
 * @param {json} data - The data of the request
 * @returns {json} The response of the API
 */
export async function putRequestApi(token, route, data) {
  const response = await fetch(API_URL + route, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}