const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UnverifiedUserModel = require("../models/unverifiedUsers");
const UserModel = require("../models/users");

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
        res.status(500).send(err.message);
    }
}

module.exports = {
    signup
};
