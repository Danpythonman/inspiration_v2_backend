const mongoose = require("mongoose");

const ImageOfTheDaySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    photographer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

/**
 * Image of the day contains the url for the image and information about the image.
 * The information includes image title, photographer, and description.
 *
 * Timestamps are enabled so the updatedAt property can be used to check if a day has passed
 * since the image was changed, and a new image can be retrieved.
 */
const ImageOfTheDayModel = mongoose.model("image", ImageOfTheDaySchema);

module.exports = ImageOfTheDayModel;
