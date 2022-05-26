exports.makeError = (statusCode, message) => {
    return {
        result: 'error',
        statusCode,
        message
    }
}

exports.makeSuccess = (data = {}, message = 'Successfull operation') => {
    return {
        statusCode: 200,
        result: 'success',
        data,
        message
    }
}