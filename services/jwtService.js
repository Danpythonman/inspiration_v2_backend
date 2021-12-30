const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Generates auth and refresh tokens and secret hashes for auth and refresh tokens.
 *
 * The secret key for auth and refresh tokens is made from environment variables
 * and the secret hash returned by this function
 * (which will be stored in the specific users database entry).
 *
 * This is so that changing the hash in the user's database entry will invalidate all current tokens.
 *
 * @param {string} email Email of the user for which the tokens and hashes are being created.
 *
 * @returns {Object} Object containing secret hashes and tokens.
 */
const generateSecretHashesAndTokens = async (email) => {
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
        { email: email },
        process.env.JWT_AUTH_KEY + userAuthHash,
        { expiresIn: process.env.AUTH_TOKEN_LIFESPAN }
    );

    // Create hash to use as part of the secret key of the refresh token
    const userRefreshKey = crypto.randomInt(100000, 1000000).toString();
    const userRefreshHash = String(await bcrypt.hash(userRefreshKey, 10)).substring(29);
    // Create refresh token
    const refreshToken = jwt.sign(
        { email: email },
        process.env.JWT_REFRESH_KEY + userRefreshHash,
        { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
    );

    return {
        userAuthHash,
        userRefreshHash,
        authToken,
        refreshToken
    };
}

/**
 * Generates auth and refresh tokens given the secret hashes stored in the user's database entry.
 *
 * The secret key for auth and refresh tokens is made from environment variables
 * and the secret hash stored in the specific user's database entry.
 *
 * This is so that changing the hash in the user's database entry will invalidate all current tokens.
 *
 * @param {string} email Email of the user for which the tokens and hashes are being created.
 * @param {string} userAuthHash User's secret hash for auth tokens.
 * @param {string} userRefreshHash User's secret hash for refresh tokens.
 *
 * @returns {Object} Object containing auth and refresh tokens.
 */
const generateTokens = (email, userAuthHash, userRefreshHash) => {
    // Create auth token
    const authToken = jwt.sign(
        { email: email },
        process.env.JWT_AUTH_KEY + userAuthHash,
        { expiresIn: process.env.AUTH_TOKEN_LIFESPAN }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
        { email: email },
        process.env.JWT_REFRESH_KEY + userRefreshHash,
        { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
    );

    return {
        authToken,
        refreshToken
    };
}

/**
 * Generates auth token given the secret auth token hash stored in the user's database entry.
 *
 * @param {string} email Email of the user for which the tokens and hashes are being created.
 * @param {string} userAuthHash User's secret hash for auth tokens.
 *
 * @returns {string} Auth token.
 */
 const generateAuthToken = (email, userAuthHash) => {
    // Create auth token
    const authToken = jwt.sign(
        { email: email },
        process.env.JWT_AUTH_KEY + userAuthHash,
        { expiresIn: process.env.AUTH_TOKEN_LIFESPAN }
    );

    return authToken;
}

/**
 * Decodes the token and returns the decoded payload without validating the token's signature.
 *
 * @param {string} token Token to be decoded.
 *
 * @returns {Object} Decoded payload of the token.
 */
const decodeToken = (token) => {
    return jwt.decode(token);
}

/**
 * Verifies the auth token and returns the payload if valid.
 * If invalid, error.
 *
 * @param {string} token Token to be decoded.
 * @param {string} userAuthHash User's secret hash for auth tokens.
 *
 * @returns {Object} Decoded payload of the token.
 */
const verifyAuthToken = (token, userAuthHash) => {
    return jwt.verify(token, process.env.JWT_AUTH_KEY + userAuthHash);
}

/**
 * Verifies the auth token and returns the payload if valid.
 * If invalid, error.
 *
 * @param {string} token Token to be decoded.
 * @param {string} userRefreshHash User's secret hash for refresh tokens.
 *
 * @returns {Object} Decoded payload of the token.
 */
const verifyRefreshToken = (token, userRefreshHash) => {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY + userRefreshHash);
}

module.exports = {
    generateSecretHashesAndTokens,
    generateTokens,
    generateAuthToken,
    decodeToken,
    verifyAuthToken,
    verifyRefreshToken
};
