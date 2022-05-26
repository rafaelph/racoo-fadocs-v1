const axios = require('axios');

const baseUrl = process.env.AUTH_SERVICE_URL;

exports.login = (username, password) => {
    return axios.post(`${baseUrl}/token/new`, {
        username,
        password
    })
}