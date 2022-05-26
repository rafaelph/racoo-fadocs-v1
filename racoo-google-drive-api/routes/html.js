var express = require('express');
var router = express.Router();
const controller = require('../controllers/drive');
const googleDrive = require('../lib/google-drive');

router.get('/', async (req, res, next) => {
    const responseFromDrive = await controller.getFileList();
    const {
        data
    } = responseFromDrive;
    res.render('index', {
        isResultUrl: data.result === 'url',
        ...data
    });
});


router.post('/code', async (req, res, next) => {
    const code = req.body.code;
    if (!code) {
      res.render('index', {
        isResultUrl: true,
        isResultError: true,
        errorMessage: 'Debe proveer un código válido'
      });
    } else {
        const credentials = await googleDrive.readClientSecret();
        if (!credentials) {
            return makeError(422, 'No user credentials stored');
        }
        // Generate an oAuth2Client
        const oAuth2Client = googleDrive.getoAuth2Client(credentials);
        try {
            // Get token from code
            const token = await googleDrive.getTokenFromCodeAndReturn(oAuth2Client, code)
            res.render('index', {
                isResultUrl: true,
                isResultError: false,
                isResultToken: true,
                token: JSON.stringify(token)
            });
        } catch (error) {
            res.render('index', {
                isResultUrl: true,
                isResultError: true,
                isResultToken: false,
                errorMessage: `Error al general el token: ${error.message || 'Error desconocido'}`
            });
        }
    }
});



module.exports = router;