const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true }
);

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
    tasks: {
        type: [TaskSchema],
        required: true
    },
    lastLoginDate: {
        type: Date,
        required: false
    },
}, { timestamps: true }
);

/**
 * Users contain an email, name, hashes for secret keys for auth and refresh tokens,
 * their list of tasks, and the date of their most recent login.
 * They also have timestamps enabled, which means they include createdAt and updatedAt fields.
 */
const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
