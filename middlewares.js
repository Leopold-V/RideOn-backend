const errorHandler = (req, res, next) => {
    const error = new Error('Route not found');
    res.status(404);
    next(error)
}

const notFound = (error, req, res, next) => {
    const statusCode = !res.statusCode ? 500 : res.statusCode
    res.status(statusCode);
    return res.json({
        code: res.statusCode,
        slack: error.stack,
        message: error.message
    })
}

module.exports = { 
    errorHandler, 
    notFound
}