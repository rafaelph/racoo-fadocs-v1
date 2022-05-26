import { handleResponse } from '../helpers/handleResponse';
import axios from 'axios';

const getFiles = async (parentId = 'root') => {
    const apiUrl = process.env.REACT_APP_DRIVE_URL ? `${process.env.REACT_APP_DRIVE_URL}/api/user/get-files/${parentId}`: `api/user/get-files/${parentId}`;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'access-token': currentUser.token,
            }
        };
        const response = await axios(apiUrl, requestOptions);
        return response.data;
    } else {
        throw new Error('No hay usuario almacenado en el loalStorage');
    }
}

const getFadocs = async (parentId = 'root') => {
    const apiUrl = process.env.REACT_APP_DRIVE_URL ? `${process.env.REACT_APP_DRIVE_URL}/api/user/get-fadocs/${parentId}` : `api/user/get-fadocs/${parentId}`;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'access-token': currentUser.token,
            }
        };
        const response = await axios(apiUrl, requestOptions);
        return response.data;
    } else {
        throw new Error('No hay usuario almacenado en el loalStorage');
    }
}

const getLabelsFromFiles = async (files) => {
    const apiUrl = process.env.REACT_APP_DRIVE_URL ? `${process.env.REACT_APP_DRIVE_URL}/api/user/get-etiquetas-from-file` : `api/user/get-etiquetas-from-file`;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'access-token': currentUser.token,
            },
            body: JSON.stringify({
                files
            })
        };
        const response = await fetch(apiUrl, requestOptions);
        const filesResponse = await handleResponse(response);
        return filesResponse.data;
    } else {
        throw new Error('No hay usuario almacenado en el loalStorage');
    }
}

const downloadLocalFile = async (filePath, name) => {
    const apiUrl = process.env.REACT_APP_DRIVE_URL ? `${process.env.REACT_APP_DRIVE_URL}/api/user/download` : `api/user/download`;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'access-token': currentUser.token,
            },
            body: JSON.stringify({
                filePath
            })
        };
        const response = await fetch(apiUrl, requestOptions);
        const blobInResponse = await response.blob();
        const fileOfBlob = new File([blobInResponse], name);
        return fileOfBlob;
    } else {
        throw new Error('No hay usuario almacenado en el localStorage');
    }
}

export const driveService = {
    getFiles,
    getLabelsFromFiles,
    downloadLocalFile,
    getFadocs
}