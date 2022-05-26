import { BehaviorSubject } from 'rxjs';

import { handleResponse } from '../helpers/handleResponse';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
  login,
  register,
  logout,
  setDrive,
  changePassword,
  requestChangePassword,
  recreatePassword,
  savePhoto,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

// Opciones comunes en casi todas las peticiones
const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  const apiUrl = process.env.REACT_APP_DRIVE_URL ? `${process.env.REACT_APP_DRIVE_URL}/auth/login` : 'auth/login';
  return fetch(apiUrl, requestOptions)
    .then(handleResponse)
    .then(responseLogin => {
      const { data } = responseLogin;
      if (data.response) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(data.result));
        currentUserSubject.next(data.result);
      }
      return data;
    });
}

async function register(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: username,
      email: username,
      clave: password,
    }),
  };

  const apiUrl = process.env.REACT_APP_AUTH_URL ? `${process.env.REACT_APP_AUTH_URL}/register/fadocs` : `register/fadocs`;
  const response = await fetch(apiUrl, requestOptions);
  return await handleResponse(response);
}

async function setDrive(code) {
  const apiUrl = process.env.REACT_APP_DRIVE_URL? `${process.env.REACT_APP_DRIVE_URL}/api/user/set-drive` : `api/user/set-drive`;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.token) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': currentUser.token,
      },
      body: JSON.stringify({ code }),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      console.log('Response code', response);
      return response;
    } catch (error) {
      console.log('Error code', error);
    }
  } else {
    throw new Error('No hay usuario almacenado en el loalStorage');
  }
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}

/**
 * Funcion para solicitar cambiar la contraseña porque se olvidó
 *
 * @param email Dirección de correo del usuario
 * @returns {Promise<Response>}
 */
async function requestChangePassword(email) {
  // Dominio donde está corriendo la app incluye el puerto y el protocolo
  const appName = window.location.origin;
  const body = JSON.stringify({ email, appName });

  const apiUrl = process.env.REACT_APP_AUTH_URL ? `${process.env.REACT_APP_AUTH_URL}/enviarCambioPassword` : `enviarCambioPassword`;

  return fetch(
    apiUrl,
    { ...requestOptions, body }
  ).then((res) => res.json());
}

/**
 * Recrea una contraseña de un usuario que la olvidó.
 *
 * @param password Nueva contraseña introducida por el usuario
 * @param token Token para identificar el usuario
 * @returns {Promise<any>}
 */
async function recreatePassword(password, token) {
  const body = JSON.stringify({ password, token });

  const apiUrl = process.env.REACT_APP_AUTH_URL ? `${process.env.REACT_APP_AUTH_URL}/cambiarpassword` : `cambiarpassword`;

  return fetch(
    apiUrl,
    { ...requestOptions, body }
  ).then((res) => res.json());
}

async function changePassword(newPassword) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.usuario_id;
  const apiUrl = process.env.REACT_APP_AUTH_URL ? `${process.env.REACT_APP_AUTH_URL}/changepassword/${userId}`: `changepassword/${userId}`;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      newPassword,
    })
  };
  try {
    const response = await fetch(apiUrl, requestOptions)
    console.log('Response cambio password', response);
    return response;
  } catch (error) {
    console.log('Error code', error)
  }
}

async function savePhoto(image) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.usuario_id;
  const apiUrl = process.env.REACT_APP_AUTH_URL ? `${process.env.REACT_APP_AUTH_URL}/update-image/${userId}`: `update-image/${userId}`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image,
    }),
  };
  const response = await fetch(apiUrl, requestOptions);
  currentUser.img = image;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  return response;
}
