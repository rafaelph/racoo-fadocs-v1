exports.handleError = (res, error) => {
    console.log('Error', error)
    res.status(500).json(error);
}