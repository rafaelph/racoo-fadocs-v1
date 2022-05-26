const { google } = require('googleapis');
const fsPromises = require('fs').promises;
var fs = require('fs');
const stream = require('stream');
const { types } = require('./google-drive-types');

// Load client secrets from a local file.
const readClientSecret = async () => {
    const credentials = await fsPromises.readFile('credentials.json');
    return JSON.parse(credentials);
}

exports.readClientSecret = readClientSecret;
exports.getoAuth2Client = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return oAuth2Client;
}

const getOAuthClient = async () => {
    try {
        const credentials = await readClientSecret();
        if (!credentials) {
            throw new Error('No credentials stored');
        }
        // Generate an oAuth2Client
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        return oAuth2Client;
    } catch(error) {
        console.log('There was an error getting the credentials', error)
        throw new Error('There was an error getting the credentials');
    }
}

exports.getOAuthClient = getOAuthClient;

exports.getToken = async () => {
    try {
        const token = await fsPromises.readFile('token.json');
        return JSON.parse(token);
    } catch (error) {
        return null;
    }
}

const generateAuthUrl = (oAuth2Client) => {
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive'
        ]
    });
}

exports.generateAuthUrl = generateAuthUrl;
exports.getTokenFromCode = (oAuth2Client, code) => {
    return new Promise((resolve, reject) => {
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                reject(err);
            }
            oAuth2Client.setCredentials(token);
            // Store the token
            fs.writeFile('token.json', JSON.stringify(token));
            resolve(oAuth2Client);
        });
    })
}

exports.getTokenFromCodeAndReturn = (oAuth2Client, code) => {
    return new Promise((resolve, reject) => {
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                reject(err);
            }
            resolve(token);
        });
    })
}

/**
 * Lists the names and ids of files
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = async (auth, parentId = 'root') => {
    let files = [];
    const drive = google.drive({ version: 'v3', auth });
    let pageToken = null;
    while (true) {
        const result = await listBlock(drive, pageToken, parentId);

        files = files.concat(result.files.map(file => {
            return {
                ...file,
                parentId
            }
        }));
        pageToken = result.pageToken;
        // When finished pageToken is null
        if (!pageToken) {
            return files;
        }
    }
}

const listToTree = (items, id = 'root', link = 'parentId') => {
    const parents = items.filter(item => item[link] === id);
    parents.map(item => ({ ...item, children: listToTree(items, item.id) }));
    return parents;
}

exports.listFiles = listFiles;

exports.getFileList = async (tokenGoogle, parentId) => {
    // Generate an oAuth2Client
    const oAuth2Client = await getOAuthClient();
    // If there is no token generate one
    if (!tokenGoogle) {
        // Generar URL para obtener el código
        const url = generateAuthUrl(oAuth2Client);
        return {
            result: 'url',
            url
        };
    } else {
        // There is a token, so we can request the files
        oAuth2Client.setCredentials(tokenGoogle);
        const files = await listFiles(oAuth2Client, parentId);
        return {
            result: 'files',
            files
        };
    }
}

const listBlock = (drive, pageToken, parentId = 'root') => {
    return new Promise((resolve, reject) => {
        drive.files.list({
            q: "'" + parentId + "' in parents and trashed = false",
            fields: 'nextPageToken, files(id, name, mimeType)',
            spaces: 'drive',
            pageToken: pageToken,
        }, (err, res) => {
            if (err) {
                // Handle error
                console.error(err);
                reject({
                    err
                });
            } else {
                resolve({
                    files: res.data.files,
                    pageToken: res.data.nextPageToken
                });
            }
        });
    })
}

/**
 * Lists the names and IDs of up to 10 files.
 *  @param {string} folderName Name to create the folder.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.createFolder = (folderName, parentId = null, auth) => {
    const drive = google.drive({ version: 'v3', auth });
    return new Promise((resolve, reject) => {
        let fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
        };
        if (parentId) {
            fileMetadata.parents = [parentId];
        }
        drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, (err, file) => {
            if (err) {
                // Handle error
                reject(err);
            } else {
                resolve(file.data.id);
            }
        });
    })
}

/**
 * Lists the names and IDs of up to 10 files.
 *  @param {object} file File to save
 *  @param {string} type Type of the file. Use one of https://github.com/google/google-drive-proxy/blob/master/DriveProxy/API/MimeType.cs
 *  @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.createFile = (file, type, parentId = null, auth) => {
    // https://developers.google.com/drive/api/v3/manage-uploads#simple
    const drive = google.drive({ version: 'v3', auth });
    const { name, data } = file;
    let bufferStream = new stream.PassThrough();
    bufferStream.end(data);
    return new Promise((resolve, reject) => {
        let fileMetadata = {
            'name': name,
        };
        if (parentId) {
            fileMetadata.parents = [parentId];
        }
        drive.files.create({
            resource: fileMetadata,
            fields: 'id',
            media: {
                mimeType: type,
                body: bufferStream,
            },
        }, (err, file) => {
            if (err) {
                // Handle error
                reject(err);
            } else {
                resolve(file.data.id);
            }
        });
    })
}

/**
 * Finds a folder and return information about it (id and name most important)
 * @param {string} folderName Folder to search for
 * @param {string} parentId If it is a subfolder, the parent id. If null then root folder is assumed
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Promise<google.file>} Folder or null if folder is not found
 */
const findFolder = async (folderName, parentId, auth) => {
    const drive = google.drive({ version: 'v3', auth });
    if (!parentId) {
        parentId = 'root';
    }
    const query = "mimeType='application/vnd.google-apps.folder' and '" + parentId + "' in parents";
    return new Promise((resolve, reject) => {
        drive.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
        }, (err, res) => {
            if (err) {
                // Handle error
                console.error('Error reading files from', err);
                reject(err);
            } else {
                const folder = res.data.files.find(f => f.name === folderName);
                resolve(folder);
            }
        })
    })
}

/**
 * @typedef {Object} Path
 * @property {boolean} invalidPath - False if path is invalid
 * @property {string} invalidFolder - Folder that was not found
 * @property {array} ids - Array of strings containing all the ids from the path. 
 * The last element of the array is the last id for the path. A path like 'parentFolder/childFolder'
 * returns an array of ['idParent', 'idChild']
 */

/**
 * Takes a path and validates that it can reach a folder in google drive
 * @param {string} path Path to the folder for example 'parentFolder/childFolder'
 * @returns {Path} Ids for this path
 */
exports.validatePath = async (path, oAuth2Client) => {
    const ids = [];
    let invalidPath = false;
    let invalidFolder;
    const steps = path.split('/');
    try {
        let deep = 0;
        for (const step of steps) {
            let folder;
            if (deep === 0) {
                folder = await findFolder(step, null, oAuth2Client);
            } else {
                const parentId = ids[deep - 1].id;
                folder = await findFolder(step, parentId, oAuth2Client);
            }
            if (folder) {
                ids[deep] = folder;
                deep++;
            } else {
                return {
                    invalidPath: true,
                    invalidFolder: step,
                    ids
                }
            }
        }
        return {
            invalidPath,
            invalidFolder,
            ids
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getPathContent = async (path, oAuth2Client, deep) => {
    let invalidPath = false;
    let invalidFolder = '';
    let ids = [];
    if (path) {
        const folderFromPath = await this.validatePath(path, oAuth2Client);
        invalidPath = folderFromPath.invalidPath;
        invalidFolder = folderFromPath.invalidFolder;
        ids = folderFromPath.ids;
    } else {
        ids.push({ id: 'root' });
    }
    try {
        if (!invalidPath) {
            const file = ids.pop();
            file.childrens = await getFileChildrens(file, oAuth2Client);
            // Add deep = 0
            file.childrens = file.childrens.map(f => {
                f.deep = 0;
                return f;
            });
            file.childrens = await getTree(file.childrens, oAuth2Client, deep);
            return {
                invalidPath,
                file
            };
        } else {
            // There is an invalid folder so we should create it
            return {
                invalidPath,
                invalidFolder
            };
        }
    } catch (error) {
        console.log(error);
    }
}

const getFileChildrens = async (file, oAuth2Client) => {
    // Find file childrens
    let childrens = []
    try {
        childrens = await this.listFiles(oAuth2Client, file.id);
    } catch (error) {
        console.log('Error fetching file childrens', error, file);
    }
    return childrens;
}

const getTree = async (files, oAuth2Client, deep = 5) => {
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const childrens = await this.listFiles(oAuth2Client, file.id);
        currentDeep = file.deep + 1;
        file.childrens = childrens.map(f => {
            f.deep = currentDeep;
            return f;
        });
        files[index] = file;
        if (currentDeep < deep) {
            await getTree(childrens, oAuth2Client, deep);
        }
    }
    return files;
}

exports.saveCredentials = (credentials) => {
    fs.writeFile('credentials.json', JSON.stringify(credentials));
}

// Roles https://developers.google.com/drive/api/v3/ref-roles
/**
 * Creates a permission over a file
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} fileId File ID obtained from listing google drive files
 * @param {string} type Scope of the permission (user, group, domain, or anyone)
 * @param {string} role Identifies the operation that the type can perform
 * @param {object} info Data related to the combination of type and role, to create a permission
 * If the type is user or group, provide an emailAddress. If the type is domain, provide a domain.
 */
exports.shareFileToUser = (auth, fileId, type, role, info = {}) => {
    const drive = google.drive({ version: 'v3', auth });
    let permission = {
        type,
        role
    };
    if (type === 'user' || type === 'group') {
        permission.emailAddress = info.emailAddress;
    }
    if (type === 'domain') {
        permission.domain = info.domain;
    }
    return new Promise((resolve, reject) => {
        drive.permissions.create({
            resource: permission,
            fileId: fileId,
            fields: 'id',
          }, (err, res) =>  {
            if (err) {
              // Handle error...
              reject(err); 
            } else {
              console.log('Permission ID: ', res.id)
              resolve(res)
            }
        });
    });    
}

exports.listFilePermissions = (auth, fileId) => {
    const drive = google.drive({ version: 'v3', auth });
    return new Promise((resolve, reject) => {
        drive.permissions.list({
            fileId,
            fields: '*'
          }, async (err, res) =>  {
            if (err) {
              // Handle error...
              reject(err); 
            } else {
              const permissions = res.data.permissions;
              const permissionsDeails = permissions;
              resolve(permissionsDeails);
            }
        });
    });
}

exports.removeFilePermission = (auth, fileId, permissionId) => {
    const drive = google.drive({ version: 'v3', auth });
    return new Promise((resolve, reject) => {
        drive.permissions.delete({
            fileId: fileId,
            permissionId
          }, (err, res) =>  {
            if (err) {
              // Handle error...
              reject(err); 
            } else {
              resolve(res)
            }
        });
    });    
}

exports.removePermissionByEmail = (auth, fileId, email) => {
    const drive = google.drive({ version: 'v3', auth });
    return new Promise((resolve, reject) => {
        drive.permissions.list({
            fileId,
            fields: '*'
          }, async (err, res) =>  {
            if (err) {
              // Handle error...
              reject(err); 
            } else {
              const permissions = res.data.permissions;
              const permissionToDelete = permissions.find(p => p.emailAddress === email)
              if (permissionToDelete) {
                drive.permissions.delete({
                    fileId: fileId,
                    permissionId: permissionToDelete.id
                  }, (err, res) =>  {
                    if (err) {
                      // Handle error...
                      reject(err); 
                    } else {
                      resolve(res)
                    }
                });
              } else {
                  resolve('No permission asociated with this user');
              }
            }
        });
    });    
}

exports.downloadFile = (auth, file) => {
    const rootDir = process.cwd();
    const destinationFolder = fs.createWriteStream(`${rootDir}/tmp/${file.id}.docx`);
    const drive = google.drive({ version: 'v3', auth });
    return drive.files.get({
        fileId: file.id,
        alt: 'media'
    }, {responseType: 'stream'})
    .then(stream => {
        return new Promise((resolve, reject) => {
            let progress = 0;
            stream.data
                  .on('end', () => {
                    resolve({
                        path: `${rootDir}/tmp/${file.id}.docx`
                    });
                  })
                  .on('error', err => {
                    reject(err);
                  })
                  .on('data', d => {
                    progress += d.length;
                    if (process.stdout.isTTY) {
                      process.stdout.clearLine();
                      process.stdout.cursorTo(0);
                      process.stdout.write(`Downloaded ${progress} bytes`);
                    }
                  })
                  .pipe(destinationFolder);
        })
    });
}

