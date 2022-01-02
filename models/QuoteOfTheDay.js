const mongoose = require("mongoose");

const QuoteOfTheDaySchema = new mongoose.Schema({
    quoteId: {
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

/**
 * Quote of the day contains the quote, the author of the quote, and the id of the quote from the API.
 *
 * Timestamps are enabled so the updatedAt property can be used to check if a day has passed
 * since the quote was changed, and a new quote can be retrieved.
 */
const QuoteOfTheDayModel = mongoose.model("quote", QuoteOfTheDaySchema);

module.exports = QuoteOfTheDayModel;
