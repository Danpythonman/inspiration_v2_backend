const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UnverifiedUserModel = require("../models/unverifiedUsers");
const UserModel = require("../models/users");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        if (await UserModel.findOne({ email: req.body.email })) {
            res.status(409).send("Email taken");
            return;
        }

        if (await UnverifiedUserModel.findOne({ email: req.body.email })) {
            res.status(409).send("Code already sent to email");
            return;
        }

        const verificationCode = crypto.randomInt(100000, 1000000).toString();

        const verificationHash = await bcrypt.hash(verificationCode, 10);

        await UnverifiedUserModel.create({
            email: req.body.email,
            verificationHash: verificationHash
        });

        const emailMessage = {
            from: "dannyjdigio@gmail.com",
            to: "dannyjdigio@gmail.com",
            subject: "Email Verification",
            text: `Your code is ${verificationCode}`
        }

        // If the test email environment variables are set, then use them
        // otherwise, use the email environment variables for production    
        const transporter = process.env.TEST_EMAIL_HOST
            ? nodemailer.createTransport({
                host: process.env.TEST_EMAIL_HOST,
                port: process.env.TEST_EMAIL_PORT,
                auth: {
                    user: process.env.TEST_EMAIL_USERNAME,
                    pass: process.env.TEST_EMAIL_PASSWORD
                }
            })
            : nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                    clientId: process.env.OAUTH_CLIENTID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN
                }
            });

        await transporter.sendMail(emailMessage);

        res.status(200).send(`Verification code sent to ${req.body.email}`);
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).send(`${req.body.email} is an invalid email address`);
        } else {
            res.status(500).send(err.message);
        }
    }
}

const verifyAccount = async (req, res) => {
    try{
        // Make sure user has already registered email for verification
        const unverifiedUser = await UnverifiedUserModel.findOne({ email: req.body.email });
        if (!unverifiedUser) {
            res.status(404).send(`Verification time exceeded, or ${req.body.email} has not registered for verification yet`);
            return;
        }

        // Check user's verification code
        if (!await bcrypt.compare(req.body.verificationCode, unverifiedUser.verificationHash)) {
            res.status(400).send("Verification code invalid");
            return;
        }

        /*
         * CREATING AUTH AND REFRESH TOKENS
         *
         * The secret key for each token is the secret key from the environment variable
         * concatenated with the secret key stored in their database entry.
         *
         * The secret key in their database entry is the hash of a random number
         * from character 29 to the end of the string.
         *
         * (With bcrypt the hash part starts at character 29).
         * (This is to keep the secret key from being very long).
         */

        // Create hash to use as part of the secret key of the auth token
        const userAuthKey = crypto.randomInt(100000, 1000000).toString();
        const userAuthHash = String(await bcrypt.hash(userAuthKey, 10)).substring(29);
        // Create auth token
        const authToken = jwt.sign(
            { email: req.body.email },
            process.env.JWT_AUTH_KEY + userAuthHash,
            { expiresIn: process.env.AUTH_TOKEN_LIFESPAN }
        );

        // Create hash to use as part of the secret key of the refresh token
        const userRefreshKey = crypto.randomInt(100000, 1000000).toString();
        const userRefreshHash = String(await bcrypt.hash(userRefreshKey, 10)).substring(29);
        // Create refresh token
        const refreshToken = jwt.sign(
            { email: req.body.email },
            process.env.JWT_REFRESH_KEY + userRefreshHash,
            { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
        );

        await UserModel.create({
            email: req.body.email,
            name: req.body.name,
            authTokenHash: userAuthHash,
            refreshTokenHash: userRefreshHash,
            lastLoginDate: Date.now()
        });

        res.status(201).send({ auth: authToken, refresh: refreshToken });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    signup,
    verifyAccount
};
