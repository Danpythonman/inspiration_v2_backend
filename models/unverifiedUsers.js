const mongoose = require("mongoose");

const UnverifiedUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    verificationHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        expires: 300,
        default: Date.now
    }
});

/**
 * Unverified users contain an email and a hash of the verification code sent to the specified email.
 * (The hash is used instead of the actual verification code as a security measure).
 *
 * These database entries expire after 5 minutes (300 seconds), so the user has 5 minutes to verify their email.
 */
const UnverifiedUserModel = mongoose.model("unverifieduser", UnverifiedUserSchema);

module.exports = UnverifiedUserModel;
