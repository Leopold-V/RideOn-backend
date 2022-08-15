import jwt from 'jsonwebtoken';

export const errorHandler = (req, res, next) => {
    const error = new Error('Route not found');
    res.status(404);
    next(error)
}

export const notFound = (error, req, res, next) => {
    const statusCode = !res.statusCode ? 500 : res.statusCode
    res.status(statusCode);
    return res.json({
        code: res.statusCode,
        slack: error.stack,
        message: error.message
    })
}

export const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: true, isAuth: false, message: 'Unanthenticated user' });
    }
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).send({ error: true, isAuth: false, message: 'Failed to authenticate with this token.' });
        }
        next();
    });
};