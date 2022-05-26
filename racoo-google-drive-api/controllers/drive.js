const googleDrive = require('../lib/google-drive');
const { makeError, makeSuccess } = require('../helpers/response');
const { validatePath } = require('../lib/google-drive');
const path = require('path');
const { types } = require('../lib/google-drive-types');
const userController = require('./user');

const getOAuthClient = async () => {
    try {
        const credentials = await googleDrive.readClientSecret();
        if (!credentials) {
            throw new Error('No credentials stored');
        }
        // Generate an oAuth2Client
        const oAuth2Client = googleDrive.getoAuth2Client(credentials);
        return oAuth2Client;
    } catch(error) {
        console.log('There was an error getting the credentials', error)
        throw new Error('There was an error getting the credentials');
    }
}

exports.getOAuthClient = getOAuthClient;
exports.getFileList = async (tokenGoogle) => {
    try {
        // Generate an oAuth2Client
        const oAuth2Client = await getOAuthClient();
        // If there is no token generate one
        if (!tokenGoogle) {
            // Generar URL para obtener el código
            const url = googleDrive.generateAuthUrl(oAuth2Client);
            return makeSuccess({
                result: 'url',
                url
            });
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(tokenGoogle);
            const files = await googleDrive.listFiles(oAuth2Client);
            return makeSuccess({
                result: 'files',
                files
            });
        }
    } catch (error) {
        return makeError(500, error.message || 'Error listing files');
    }
}

exports.getTokenFromCode = async (code) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get token from code
        const newAuth = await googleDrive.getTokenFromCode(oAuth2Client, code);
        const files = await googleDrive.listFiles(newAuth);
        return makeSuccess(files);
    } catch (error) {
        return makeError(500, error.message || 'Error listing files');
    }
}

exports.createFolders = async (path, folders) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            let parentId;
            if (path) {
                const pathValidation = await createValidPath(path, oAuth2Client);
                parentId = pathValidation.ids.pop().id;
            }
            await createFoldersUnderParent(folders, parentId, oAuth2Client);
            return makeSuccess();
        }
    } catch (error) {
        return makeError(500, error.message || 'Error creating folders');
    }
}

const createFoldersUnderParent = async (folders, parentId, oAuth2Client) => {
    const promises = [];
    for (const folder of folders) {
        promises.push(googleDrive.createFolder(folder, parentId, oAuth2Client));
    }
    return await Promise.all(promises);
}

const createValidPath = async (path, oAuth2Client) => {
    let pathValidation = await validatePath(path, oAuth2Client);
    if (pathValidation.invalidPath) {
        // Create missing folder
        // If the validation did not founded any valid folders then we use root
        const lastFolder = pathValidation.ids.length > 0 ? pathValidation.ids.pop() : undefined;
        // Create the missing folder
        await googleDrive.createFolder(pathValidation.invalidFolder, lastFolder.id, oAuth2Client);
        pathValidation = await createValidPath(path, oAuth2Client);
    }
    return pathValidation;
}

exports.getPathContent = async (path, deep) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            const result = await googleDrive.getPathContent(path, oAuth2Client, deep);
            return makeSuccess(result);
        }
    } catch (error) {
        return makeError(500, error.message || 'Error retreiving path content');
    }
}

exports.loadCredentials = async (credentials) => {
    try {
        await googleDrive.saveCredentials(credentials);
        return makeSuccess();
    } catch (error) {
        return makeError(500, error.message || 'Error storing credentials');
    }
}

exports.shareFileToUser = async (fileId, userEmail) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            await googleDrive.shareFileToUser(oAuth2Client, fileId, 'user', 'writer', { emailAddress: userEmail });
            return makeSuccess();
        }
    } catch (error) {
        return makeError(500, error.message || 'Error retreiving path content');
    }    
}

exports.listFIlePermissions = async (fileId) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            const result = await googleDrive.listFilePermissions(oAuth2Client, fileId);
            return makeSuccess(result);
        }
    } catch (error) {
        return makeError(500, error.message || 'Error listing permissions');
    }    
}

exports.removeFilePermission = async (fileId, permissionId) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            const result = await googleDrive.removeFilePermission(oAuth2Client, fileId, permissionId);
            return makeSuccess();
        }
    } catch (error) {
        return makeError(500, error.message || 'Error removing permission');
    }  
}

exports.removePermissionByEmail = async (fileId, email) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            const result = await googleDrive.removePermissionByEmail(oAuth2Client, fileId, email);
            return makeSuccess(result);
        }
    } catch (error) {
        return makeError(500, error.message || 'Error removing permission');
    }  
}

exports.createFile = async (filePath, file) => {
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    // Generate an oAuth2Client
    const oAuth2Client = googleDrive.getoAuth2Client(credentials);
    try {
        // Get the token
        const token = await googleDrive.getToken();
        // If there is no token generate ask for a new one
        if (!token) {
            return makeError(422, 'Access expired, please generate token again')
        } else {
            // There is a token, so we can request the files
            oAuth2Client.setCredentials(token);
            let parentId;
            if (filePath) {
                const pathValidation = await createValidPath(filePath, oAuth2Client);
                parentId = pathValidation.ids.pop().id;
            }
            // Get file extension
            const extension = path.extname(file.name);
            const type = types.find(e => e.fileExtension === extension);
            await googleDrive.createFile(file, type.mymeType, parentId, oAuth2Client);
            return makeSuccess();
        }
    } catch (error) {
        return makeError(500, error.message || 'Error creating files');
    }
}