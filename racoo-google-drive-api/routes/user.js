var express = require('express');
var router = express.Router();
const controller = require('../controllers/user');
const driveController = require('../controllers/user');
const googleDrive = require('../lib/google-drive');
const { handleLoginResponse, handle } = require('../helpers/handle-response');
const { handleError } = require('../helpers/handle-error');
const { makeError } = require('../helpers/response');

router.post('/edit-metadata', async (req, res, next) => {
    const { metadata } = req.body
    const token = req.headers[process.env.TOKEN_NAME];
    handleLoginResponse(controller.editMetadata(token, metadata), res);
});

router.post('/set-drive', async (req, res, next) => {
    const { code } = req.body
    const tokenSolicitud = req.headers[process.env.TOKEN_NAME];
    const credentials = await googleDrive.readClientSecret();
    if (!credentials) {
        return makeError(422, 'No user credentials stored');
    }
    try {
        if (code) {
            const oAuth2Client = googleDrive.getoAuth2Client(credentials);
            const tokenGoogle = await googleDrive.getTokenFromCodeAndReturn(oAuth2Client, code);
            const result = await controller.editMetadata(tokenSolicitud, {tokenGoogle});
            if (result.status === 200) {
                res.status(200).json(result.data)
            } else {
                handleError(res, result.data)
            }
        } else {
            const result = await controller.editMetadata(tokenSolicitud, null);
            if (result.status === 200) {
                res.status(200).json(result.data)
            } else {
                handleError(res, result.data)
            }
        }
    } catch (error) {
        handleError(res, error)
    }
});

router.get('/get-files/:parentId?', async (req, res, next) => {
    const tokenSolicitud = req.headers[process.env.TOKEN_NAME];
    const parentId = req.params.parentId;
    try {
        const filesResponse = await controller.getFiles(tokenSolicitud, parentId);
        res.status(200).json(filesResponse);
    } catch (error) {
        handleError(res, error)
    }
     
});

router.get('/get-fadocs/:parentId?', async (req, res, next) => {
    const tokenSolicitud = req.headers[process.env.TOKEN_NAME];
    const parentId = req.params.parentId;
    try {
        const filesResponse = await controller.getFadocsFiles(tokenSolicitud, parentId);
        res.status(200).json(filesResponse);
    } catch (error) {
        handleError(res, error)
    }
     
});

router.post('/get-etiquetas-from-file', async (req, res, next) => {
    const tokenSolicitud = req.headers[process.env.TOKEN_NAME];
    const files = req.body.files;
    try {
        const response = controller.sendFilesToFadocs(tokenSolicitud, files);
        handle(response, res);
    } catch (error) {
        const errorResponse = makeError(500, `Error al obtener los archivos del usuario: ${error.message || 'Error desconocido'}`)
        handle(errorResponse, res)
    }
});

router.post('/download', async (req, res, next) => {
    const file = req.body.filePath;
    res.download(file);
});

module.exports = router;