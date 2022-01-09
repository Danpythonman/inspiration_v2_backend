const nodemailer = require("nodemailer");

/**
 * Sends verification code to specified email.
 *
 * @param {string} emailRecipient Email to which the verification code is being sent to.
 * @param {string} endpoint The endpoint that is calling this function; either signup, login, or delete account.
 * @param {string} verificationCode Verification code to send to the specified email.
 *
 * @returns {Promise<undefined>}
 */
const sendVerificationCode = async (emailRecipient, endpoint, verificationCode) => {
    const emailMessage = {
        from: process.env.EMAIL_SENDER,
        to: emailRecipient,
        subject: "Verification Code",
        text: `Your ${endpoint} verification code is ${verificationCode} This verification code will expire in about 5 minutes. Do not share this code.`,
        html: `
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="text-align: center;">
                        <div style="font-family: Arial;">
                            <h1>Your ${endpoint} Verification Code is</h1>
                            <h1 style="font-size: 5rem">${verificationCode}</h1>
                        </div>
                    </td>
                </tr>
            </table>
            <p style="font-family: Arial;">This verification code will expire in about 5 minutes. Do not share this code.</p>
        `
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
