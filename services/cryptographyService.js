const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * Returns a random 6-digit number (as a string).
 *
 * @returns {string} Random 6-digit number as a string.
 */
const generateVerificationCode = () => {
    return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Returns a hash of the specified verification code using bcrypt with 10 salt rounds.
 *
 * @param {string} verificationCode Verification code to be hashed.
 *
 * @returns {Promise<string>} bcrypt hash of the verificationCode.
 */
const generateVerificationHash = async (verificationCode) => {
    return await bcrypt.hash(verificationCode, 10);
}

/**
 * Compares the verification code against the verification hash.
 *
 * @param {string} verificationCode Verification code sent by user.
 * @param {string} verificationHash Verification hash stored in user's entry in database.
 *
 * @returns {Promise} Promise rejects if verification code does not match the hash.
 */
const verifyVerificationCode = async (verificationCode, verificationHash) => {
    return await bcrypt.compare(verificationCode, verificationHash);
}

module.exports = {
    generateVerificationCode,
    generateVerificationHash,
    verifyVerificationCode
};
