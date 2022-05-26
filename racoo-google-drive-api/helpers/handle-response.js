exports.handle = (promise, res) => {
    promise.then(response => {
        res.status(200).json({
            data: response.data,
            message: response.message
        })
    })
    .catch(error => {
        console.log('Error', error)
        res.status(500).json(error);
    });
}

exports.handleLoginResponse = (promise, res) => {
    promise.then(response => {
        res.status(response.status).json({
            data: response.data,
            message: response.data.message
        })
    })
    .catch(error => {
        res.status(500).json(error);
    });
}