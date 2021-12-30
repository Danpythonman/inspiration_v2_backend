const jwtService = require("../services/jwtService");
const databaseService = require("../services/databaseService");

const verifyRefreshToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
            res.setHeader("WWW-Authenticate", "Bearer");
            res.status(401).send("Unauthorized - No token provided");
            return;
        }

        // JWT has the form:
        // Bearer <token>
        // so to get the token part we split the string and the space and get the second part.
        const token = bearerHeader.split(" ")[1];

        const payload = jwtService.decodeToken(token);

        req.body.user = await databaseService.getUserByEmail(payload.email);
        if (!req.body.user) {
            res.status(404).send(`User with email ${payload.email} not found`);
            return;
        }

        try {
            req.token = jwtService.verifyRefreshToken(token, req.body.user.refreshTokenHash);
        } catch (jwtError) {
            res.setHeader("WWW-Authenticate", "Bearer");
            res.status(401).send(`Unauthorized - ${jwtError.message}`);
            return;
        }

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const verifyAuthToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
            res.setHeader("WWW-Authenticate", "Bearer");
            res.status(401).send("Unauthorized - No token provided");
            return;
        }

        // JWT has the form:
        // Bearer <token>
        // so to get the token part we split the string and the space and get the second part.
        const token = bearerHeader.split(" ")[1];

        const payload = jwtService.decodeToken(token);

        req.body.user = await databaseService.getUserByEmail(payload.email);
        if (!req.body.user) {
            res.status(404).send(`User with email ${payload.email} not found`);
            return;
        }

        try {
            req.token = jwtService.verifyAuthToken(token, req.body.user.authTokenHash);
        } catch (jwtError) {
            res.setHeader("WWW-Authenticate", "Bearer");
            res.status(401).send(`Unauthorized - ${jwtError.message}`);
            return;
        }

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    verifyAuthToken,
    verifyRefreshToken
};
