const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    authTokenHash: {
        type: String
    },
    refreshTokenHash: {
        type: String
    },
    lastLoginDate: {
        type: Date,
        required: false
    },
}, { timestamps: true }
);

/**
 * Users contain an email, name, hashes for secret keys for auth and refresh tokens, and the date of their most recent login.
 * They also have timestamps enabled, which means they include createdAt and updatedAt fields.
 */
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
