var express = require('express');
var router = express.Router();
const controller = require('../controllers/drive');
const { handle } = require('../helpers/handle-response');
const { body, validationResult } = require('express-validator');

/**
 * Proceso de autenticación
 * 1- Hay que almacenar las creentials que da Google y que identifican a la aplicación
 * en el archivo credentials.json
 * 2- Se consulta la URl /api/files del proyecto, esta URL revisa si ya existe el token, si no, 
 * devuelve una URl para que generes un código de acceso con google
 * 3- Con el codigo de acceso se genera el token y con ese token se puede acceder a drive
 */

/**
 * Punto de entrada. Esta ruta trata de leer los archivos, y devuelve una URL para
 * obtener el token en caso de que este no exista
 */
router.get('/files', async (req, res, next) => {
  const tokenSolicitud = req.headers[process.env.TOKEN_NAME];
  handle(controller.getFileList(tokenSolicitud), res);
});

router.post('/code', async (req, res, next) => {
  const code = req.body.code;
  if (!code) {
    res.status(422).json({message: 'No code provided'});
    return;
  }
  handle(controller.getTokenFromCodeAndReturn(code), res);
});

router.post('/createfolders', 
  [
    body('folders').isArray({min: 1}).withMessage('You must provide at least one folder')
  ], 
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const {path, folders} = req.body
    handle(controller.createFolders(path, folders), res);
});

router.post('/createfile', 
  async (req, res, next) => {
    if (!req.files) {
      return res.status(422).json({ errors: ['No file found'] });
    }
    const { path } = req.body;
    handle(controller.createFile(path, req.files.file), res);
});

router.post('/readtree',  
  async (req, res, next) => {
    const { path, deep } = req.body;
    numericDeep = isNaN(deep) ? parseInt(deep) : 5;
    handle(controller.getPathContent(path, numericDeep), res);
});

router.post('/share-file-to-user', 
  [
    body('fileId').exists().withMessage('You must provide a file id'),
    body('email').isEmail().withMessage('You must provide a valid email')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { fileId, email } = req.body;
    handle(controller.shareFileToUser(fileId, email), res);
});

router.post('/readtree',  
  async (req, res, next) => {
    const { path, deep } = req.body;
    numericDeep = isNaN(deep) ? parseInt(deep) : 5;
    handle(controller.getPathContent(path, numericDeep), res);
});

router.post('/list-file-permissions', 
  [
    body('fileId').exists().withMessage('You must provide a file id')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { fileId } = req.body;
    handle(controller.listFIlePermissions(fileId), res);
});

router.post('/remove-file-permission', 
  [
    body('fileId').exists().withMessage('You must provide a file id'),
    body('permissionId').exists().withMessage('You must provide a permission id')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { fileId, permissionId } = req.body;
    handle(controller.removeFilePermission(fileId, permissionId), res);
});

router.post('/remove-user-permissions', 
  [
    body('email').isEmail().withMessage('You must provide a valid email'),
    body('fileId').exists().withMessage('You must provide a file id'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { fileId, email } = req.body;
    handle(controller.removePermissionByEmail(fileId, email), res);
});

module.exports = router;
