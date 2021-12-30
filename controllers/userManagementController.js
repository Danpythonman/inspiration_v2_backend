const databaseService = require("../services/databaseService");
const cryptographyService = require("../services/cryptographyService");
const emailService = require("../services/emailService");
const jwtService = require("../services/jwtService");
const { Error: { ValidationError } } = require("mongoose");

const signup = async (req, res) => {
    try {
        if (await databaseService.getUserByEmail(req.body.email)) {
            res.status(409).send("Email taken");
            return;
        }

        if (await databaseService.getVerificationRequestByEmail(req.body.email)) {
            res.status(409).send("Code already sent to email");
            return;
        }

        const verificationCode = cryptographyService.generateVerificationCode();
        const verificationHash = await cryptographyService.generateVerificationHash(verificationCode);

        await databaseService.createVerificationRequest(req.body.email, verificationHash);

        await emailService.sendVerificationCode(req.body.email, verificationCode);

        res.status(200).send(`Verification code sent to ${req.body.email}`);
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send(`${req.body.email} is an invalid email address`);
        } else {
            res.status(500).send(err.message);
        }
    }
}

const verifySignup = async (req, res) => {
    try{
        // Make sure user has already registered email for verification
        const verificationRequest = await databaseService.getVerificationRequestByEmail(req.body.email);
        if (!verificationRequest) {
            res.status(404).send(`Verification time exceeded, or ${req.body.email} has not registered for verification yet`);
            return;
        }

        // Check user's verification code
        if (!await cryptographyService.verifyVerificationCode(req.body.verificationCode, verificationRequest.verificationHash)) {
            res.status(400).send("Verification code invalid");
            return;
        }

        const { userAuthHash, userRefreshHash, authToken, refreshToken } = await jwtService.generateSecretHashesAndTokens(req.body.email);

        await databaseService.createUser(req.body.email, req.body.name, userAuthHash, userRefreshHash);

        res.status(201).send({ auth: authToken, refresh: refreshToken });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const login = async (req, res) => {
    try {
        if (await databaseService.getVerificationRequestByEmail(req.body.email)) {
            res.status(409).send("Code already sent to email");
            return;
        }

        if (!await databaseService.getUserByEmail(req.body.email)) {
            res.status(404).send(`User with email ${req.body.email} does not exist`);
            return;
        }

        const verificationCode = cryptographyService.generateVerificationCode();
        const verificationHash = await cryptographyService.generateVerificationHash(verificationCode);

        await databaseService.createVerificationRequest(req.body.email, verificationHash);

        await emailService.sendVerificationCode(req.body.email, verificationCode);

        res.status(200).send(`Verification code sent to ${req.body.email}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        // Make sure user has already registered email for verification
        const verificationRequest = await databaseService.getVerificationRequestByEmail(req.body.email);
        if (!verificationRequest) {
            res.status(404).send(`Verification time exceeded, or ${req.body.email} has not registered for verification yet`);
            return;
        }

        const loginUser = await databaseService.getUserByEmail(req.body.email);
        if (!loginUser) {
            res.status(404).send(`User with email ${req.body.email} not found`);
            return;
        }

        // Check user's verification code
        if (!await cryptographyService.verifyVerificationCode(req.body.verificationCode, verificationRequest.verificationHash)) {
            res.status(400).send("Verification code invalid");
            return;
        }

        const { authToken, refreshToken } = await jwtService.generateTokens(req.body.email, loginUser.authTokenHash, loginUser.refreshTokenHash);

        res.status(200).send({ auth: authToken, refresh: refreshToken });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const refresh = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const authToken = jwtService.generateAuthToken(req.token.email, req.body.user.authTokenHash);

        res.status(200).send(authToken);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const changeName = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const updatedUser = await databaseService.updateUserName(req.token.email, req.body.updatedName);
        if (!updatedUser) {
            // This is probably not a 404 error because the user had to be found
            // in the database to pass the JWT middlewear to get to this function.
            res.status(500).send("Unable to change name");
            return;
        }

        res.status(200).send("Name changed successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    signup,
    verifySignup,
    login,
    verifyLogin,
    refresh,
    changeName
};
