const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const options = {
    algorithms: ['HS512'],
    maxAge: '1m',
    issuer: 'ZodiacBuddyDB',
    audience: ['ZodiacBuddy']
}

exports.checkJWT = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(401).json('Access token is missing or invalid');
    }

    jwt.verify(token, SECRET_KEY, options, (err, decoded) => {
        if (err) {
            console.info(`Invalid token: ${err.message}`)
            return res.status(401).json('Access token is missing or invalid');
        } else if (!decoded.sub) {
            console.info(`Missing sub in token: ${JSON.stringify(decoded)}`)
            return res.status(401).json('Access token is missing or invalid');
        }
        req.cid = decoded.sub;
        req.aud = decoded.aud;
        next();
    });
}