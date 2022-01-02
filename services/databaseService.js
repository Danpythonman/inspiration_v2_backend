const VerificationRequestModel = require("../models/verificationRequests");
const UserModel = require("../models/users");
const ImageOfTheDayModel = require("../models/ImageOfTheDay");

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
const createVerificationRequest = async (email, verificationType, verificationHash) => {
    await VerificationRequestModel.create({
        email: email,
        verificationType: verificationType,
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
 * Deletes the specified verification request in the database.
 *
 * If no verification request is found, an error is not thrown (undefined still returned).
 * This is because the verification request may have timed out before it can be found and deleted,
 * which is fine since it was about to be deleted anyways.
 *
 * @param {string} email The email associated with the verification request.
 *
 * @returns {Promise<undefined>}
 */
 const deleteVerificationRequest = async (email) => {
    await VerificationRequestModel.findOneAndDelete({ email: email });
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

/**
 * Changes the specified user's secret hashes for auth and refresh tokens.
 *
 * @param {string} email The email of the user.
 * @param {string} userAuthHash New secret hash for user's auth tokens.
 * @param {string} userRefreshHash New secret hash for user's refresh tokens.
 *
 * @returns {Promise} The updated object of the user. If update unsuccessful, undefined is returned.
 */
const changeUserSecretHashes = async (email, userAuthHash, userRefreshHash) => {
    return await UserModel.findOneAndUpdate({ email: email }, { authTokenHash: userAuthHash, refreshTokenHash: userRefreshHash });
}

/**
 * Deletes the specified user in the database.
 *
 * @param {string} email The email of the user.
 *
 * @returns {Promise} The deleted object of the user. If deleting unsuccessful, undefined is returned.
 */
const deleteUser = async (email) => {
    return await UserModel.findOneAndDelete({ email: email });
}

/**
 * Sets the image of the day document.
 *
 * @param {object} imageOfTheDayObject Object containing the image URL, title, photographer, and description.
 * @param {string} imageOfTheDayObject.imageUrl The URL of the image.
 * @param {string} imageOfTheDayObject.title The title of the image.
 * @param {string} imageOfTheDayObject.photographer The photographer of the image.
 * @param {string} imageOfTheDayObject.description The description of the image.
 *
 * @returns {Promise} The image of the day document in the database.
 */
 const createImageOfTheDay = async (imageOfTheDayObject) => {
    return await ImageOfTheDayModel.create(imageOfTheDayObject);
}

/**
 * Sets the image of the day document.
 *
 * @param {string} currentImageUrl The URL for the current image of the day.
 * @param {object} newImageOfTheDayObject Object containing the URL, title, photographer, and description of the new image.
 * @param {string} newImageOfTheDayObject.imageUrl The URL of the new image.
 * @param {string} newImageOfTheDayObject.title The title of the new image.
 * @param {string} newImageOfTheDayObject.photographer The photographer of the new image.
 * @param {string} newImageOfTheDayObject.description The description of the nww image.
 *
 * @returns {Promise} The updated image of the day object in the database.
 */
const setImageOfTheDay = async (currentImageUrl, newImageOfTheDayObject) => {
    return await ImageOfTheDayModel.findOneAndUpdate({ imageUrl: currentImageUrl }, newImageOfTheDayObject);
}

/**
 * Gets the image of the day document from the database.
 *
 * @returns {Promise} The image of the day object. If nothing is found, undefined is returned.
 */
const getImageOfTheDay = async () => {
    // There is only one image of the day document in the collection
    // (when getting a new image this document is updated instead of adding more documents).
    // This means that this will return an array with one document.
    const imageArray = await ImageOfTheDayModel.find({});

    // If the array is empty, the image of the day document was not found.
    if (imageArray.length < 1) {
        return undefined;
    }
    // If the array is not empty, then it has one element, which is the image of the day document.
    return imageArray[0];
}

module.exports = {
    createUser,
    getUserByEmail,
    createVerificationRequest,
    getVerificationRequestByEmail,
    deleteVerificationRequest,
    updateUserName,
    changeUserSecretHashes,
    deleteUser,
    createImageOfTheDay,
    setImageOfTheDay,
    getImageOfTheDay
};
