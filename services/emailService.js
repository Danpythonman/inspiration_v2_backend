const nodemailer = require("nodemailer");

/**
 * Sends verification code to specified email.
 *
 * @param {string} emailRecipient Email to which the verification code is being sent to.
 * @param {string} verificationCode Verification code to send to the specified email.
 *
 * @returns {Promise<undefined>}
 */
const sendVerificationCode = async (emailRecipient, verificationCode) => {
    const emailMessage = {
        from: process.env.EMAIL_SENDER,
        to: emailRecipient,
        subject: "Verification Code",
        text: `Your verification code is ${verificationCode}`
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
}

module.exports = {
    sendVerificationCode
};
