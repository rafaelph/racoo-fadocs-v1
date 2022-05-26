var express = require('express');
var router = express.Router();
const controller = require('../controllers/auth');
const { handleLoginResponse } = require('../helpers/handle-response');

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    handleLoginResponse(controller.login(username, password), res);
});

module.exports = router;
