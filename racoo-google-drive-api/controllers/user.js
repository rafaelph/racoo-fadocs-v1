const axios = require('axios');
const googleDrive = require('../lib/google-drive');
const {  makeSuccess } = require('../helpers/response');
const { getEtiquetasFromFiles } = require('../lib/fadocs')
const baseUrl = process.env.AUTH_SERVICE_URL;
exports.editMetadata = (token, metadata) => {
    const config = {
        headers: {
          'APP-TOKEN': token,
        }
    }
    
    return axios.put(`${baseUrl}/users/edit-metadata`, {
        metadata
    }, config)
}

const getUserData = (token) => {
    const config = {
        headers: {
          'APP-TOKEN': token,
        }
    }
    
    return axios.get(`${baseUrl}/users/get-user-info`, config);
}

const getFadocsUserData = (token) => {
    const config = {
        headers: {
          'APP-TOKEN': token,
        }
    }
    
    return axios.get(`${baseUrl}/users/get-fadocs-token`, config);
}

const getGoogleTokenFromUser = async (token) => {    
    const userDataResponse = await getUserData(token);
    const userData = userDataResponse.data.result[0];
    const metadata = userData && userData.metadata ? JSON.parse(userData.metadata): null;
    const tokenGoogle = metadata && metadata.tokenGoogle;
    return tokenGoogle
}

const getFadocsGoogleToken = async (token) => {    
    const fadocsTokenResponse = await getFadocsUserData(token);
    const userData = fadocsTokenResponse.data.result[0];
    const metadata = userData && userData.metadata ? JSON.parse(userData.metadata): null;
    const tokenGoogle = metadata && metadata.tokenGoogle;
    return tokenGoogle
}

exports.getFiles = async (authToken, parentId='root') => {
    const tokenGoogle = await getGoogleTokenFromUser(authToken);
    return googleDrive.getFileList(tokenGoogle, parentId)
}

exports.getFadocsFiles = async (authToken, parentId='root') => {
    const tokenGoogle = await getFadocsGoogleToken(authToken);
    return googleDrive.getFileList(tokenGoogle, parentId)
}

exports.sendFilesToFadocs = async (authToken, files) => {
    const googleToken = await getGoogleTokenFromUser(authToken);
    const oAuth2Client = await googleDrive.getOAuthClient();
    // If there is no token generate ask for a new one
    oAuth2Client.setCredentials(googleToken);
    const filePaths = [];
    let index = 0;
    for (const file of files) {
        const responseDownloadFile = await googleDrive.downloadFile(oAuth2Client, file);
        const filePath = responseDownloadFile.path;
        filePaths.push(filePath);
        files[index].filePath = filePath
        index++
    }
    const resultado = await getEtiquetasFromFiles(filePaths)
    for (index = 0; index < resultado.length; index++) {
        files[index].responseFadocs = resultado[index]
    }
    return makeSuccess(files);
}
