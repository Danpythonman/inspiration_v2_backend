const VerificationRequestModel = require("../models/verificationRequests");
const UserModel = require("../models/users");

/**
 * Creates a user document in the database.
 * It is created in a collection called users.
 *
 * @param {string} email The email of the user.
 * @param {string} name The name of the user.
 * @param {string} authSecretHash The secret hash of the auth token stored in the user's database entry.
 * @param {string} refreshSecretHash The secret hash of the refresh token stored in the user's database entry.
 *
 * @returns {Promise<undefined>} Rejects with error if creating user document in database was unsuccessful.
 */
 const createUser = async (email, name, authSecretHash, refreshSecretHash) => {
    await UserModel.create({
        email: email,
        name: name,
        authTokenHash: authSecretHash,
        refreshTokenHash: refreshSecretHash,
        lastLoginDate: Date.now()
    });
}

/**
 * Returns the user with the specified email in the database.
 * If no user with the specified email exists, undefined is returned.
 *
 * @param {string} email The email of the user.
 *
 * @returns {Promise} The object of the user with the specified email in the database.
 */
const getUserByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
}

/**
 * Creates a verification request in the database.
 * It is created in a collection called verificationrequests.
 *
 * @param {string} email The email of the user.
 * @param {string} verificationHash The hash of the verification code.
 *
 * @returns {Promise<undefined>}
 */
const createVerificationRequest = async (email, verificationHash) => {
    await VerificationRequestModel.create({
        email: email,
        verificationHash: verificationHash
    });
}

/**
 * Returns the verification request with the specified email in the database.
 * If no verification request with the specified email exists, undefined is returned.
 *
 * @param {string} email The email of the user.
 *
 * @returns {Promise} The object of the verification request with the specified email in the database.
 */
 const getVerificationRequestByEmail = async (email) => {
    return await VerificationRequestModel.findOne({ email: email });
}

/**
 * Updates the name in the database of the user with the specified email.
 *
 * @param {string} email The email of the user.
 * @param {string} updatedName The user's updated name.
 *
 * @returns {Promise} The updated object of the user. If update unsuccessful, undefined is returned.
 */
const updateUserName = async (email, updatedName) => {
    return await UserModel.findOneAndUpdate({ email: email }, { name: updatedName });
}

module.exports = {
    createUser,
    getUserByEmail,
    createVerificationRequest,
    getVerificationRequestByEmail,
    updateUserName
};
