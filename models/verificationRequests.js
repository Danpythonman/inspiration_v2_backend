const mongoose = require("mongoose");

const VerificationRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (v) {
                // Email regex from http://emailregex.com/
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(v);
            },
            message: props => `${props.value} is not a valid email address`
        }
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
 * Verification requests contain an email and a hash of the verification code sent to the specified email.
 * (The hash is used instead of the actual verification code as a security measure).
 *
 * These database entries expire after 5 minutes (300 seconds), so the user has 5 minutes to verify their email.
 */
const VerificationRequestModel = mongoose.model("verificationrequest", VerificationRequestSchema);

module.exports = VerificationRequestModel;
