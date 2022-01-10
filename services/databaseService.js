const VerificationRequestModel = require("../models/verificationRequests");
const UserModel = require("../models/users");
const ImageOfTheDayModel = require("../models/ImageOfTheDay");
const QuoteOfTheDayModel = require("../models/QuoteOfTheDay");

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
        tasks: [],
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
 * Creates the image of the day document.
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
 * Updates the image of the day document.
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

/**
 * Creates the quote of the day document.
 *
 * @param {object} quoteOfTheDayObject Object containing the quote id, quote text, and quote author.
 * @param {string} quoteOfTheDayObject.quoteId The id of the quote.
 * @param {string} quoteOfTheDayObject.quote The text of the quote.
 * @param {string} quoteOfTheDayObject.author The author of the quote.
 *
 * @returns {Promise} The quote of the day document in the database.
 */
 const createQuoteOfTheDay = async (quoteOfTheDayObject) => {
    return await QuoteOfTheDayModel.create(quoteOfTheDayObject);
}

/**
 * Updates the quote of the day document.
 *
 * @param {string} currentQuoteId The id of the current quote of the day.
 * @param {object} newQuoteOfTheDayObject Object containing the quote id, quote text, and quote author.
 * @param {string} newQuoteOfTheDayObject.quoteId The id of the quote.
 * @param {string} newQuoteOfTheDayObject.quote The text of the quote.
 * @param {string} newQuoteOfTheDayObject.author The author of the quote.
 *
 * @returns {Promise} The quote of the day document in the database.
 */
 const setQuoteOfTheDay = async (currentQuoteId, newQuoteOfTheDayObject) => {
    return await QuoteOfTheDayModel.findOneAndUpdate({ quoteId: currentQuoteId }, newQuoteOfTheDayObject);
}

/**
 * Gets the quote of the day document from the database.
 *
 * @returns {Promise} The quote of the day object. If nothing is found, undefined is returned.
 */
 const getQuoteOfTheDay = async () => {
    // There is only one quote of the day document in the collection
    // (when getting a new quote this document is updated instead of adding more documents).
    // This means that this will return an array with one document.
    const quoteArray = await QuoteOfTheDayModel.find({});

    // If the array is empty, the quote of the day document was not found.
    if (quoteArray.length < 1) {
        return undefined;
    }

    // If the array is not empty, then it has one element, which is the quote of the day document.
    return quoteArray[0];
}

/**
 * Adds a task in the specified user's array of tasks.
 *
 * @param {string} email The email of the user to whom the task is being added to.
 * @param {string} task The text of the task.
 *
 * @returns {Promise} The object of the user with the task added in their array of tasks.
 */
const addTask = async (email, task) => {
    return await UserModel.findOneAndUpdate(
        { email: email },
        {
            $push: {
                tasks: {
                    content: task
                }
            }
        },
        { new: true }
    );
}

/**
 * Updates a task in the specified user's array of tasks by replacing the text of the task.
 *
 * @param {string} email The email of the user for whom the task is being updated.
 * @param {string} taskId The ObjectId of the task in the user's array of tasks to be updated.
 * @param {string} task The new text of the task.
 *
 * @returns {Promise} The object of the user with the task updated in their array of tasks.
 */
const updateTask = async (email, taskId, task) => {
    return await UserModel.findOneAndUpdate(
        { email: email, "tasks._id": taskId },
        {
            $set: {
                "tasks.$.content": task
            }
        },
        { new: true }
    );
}

/**
 * Updates the completion status of a task in the specified user's array of tasks.
 *
 * @param {string} email The email of the user for whom the task's completion status is being updated.
 * @param {string} taskId The ObjectId of the task in the user's array of tasks to be updated.
 * @param {string} completed The new completion status of the task.
 *
 * @returns {Promise} The object of the user with the task's completion status updated in their array of tasks.
 */
const updateTaskCompletion = async (email, taskId, completed) => {
    return await UserModel.findOneAndUpdate(
        { email: email, "tasks._id": taskId },
        {
            $set: {
                "tasks.$.completed": completed
            }
        },
        { new: true }
    );
}

/**
 * Deletes a task in the specified user's array of tasks.
 *
 * @param {string} email The email of the user for whom the task is being deleted.
 * @param {string} taskId The ObjectId of the task in the user's array of tasks to be deleted.
 *
 * @returns {Promise} The object of the user with the task deleted in their array of tasks.
 */
const deleteTask = async (email, taskId) => {
    return await UserModel.findOneAndUpdate(
        { email: email },
        {
            $pull: {
                tasks: {
                    _id: taskId
                }
            }
        },
        { new: true }
    );
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
    getImageOfTheDay,
    createQuoteOfTheDay,
    setQuoteOfTheDay,
    getQuoteOfTheDay,
    addTask,
    updateTask,
    updateTaskCompletion,
    deleteTask
};
