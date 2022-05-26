const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch')
const apiUrl = 'https://api.fadocs.dnot.mx/v1';

const getEtiquetasFromFiles = async (filePaths) => {
    let index = 0;
    const respuestasFadocs = [];
    for (const filePath of filePaths) {
        const respuestaFadoc = await sendFileToFadoc(filePath);
        respuestasFadocs.push(respuestaFadoc)
        filePaths[index] = {
            filePath,
            respuestaFadoc
        }
    }
    return respuestasFadocs
}

const sendFileToFadoc = (filePath) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.submit(`${apiUrl}/docx/read`, function(err, res) {
            let body = '';
            res.on('data', chunk => {
                body += chunk.toString();
            })
            res.on('end', () => {
                resolve(body);
            });
            res.on('error', (error) => {
                reject(error)
            });
        });
    })
}

module.exports = {
    getEtiquetasFromFiles
}