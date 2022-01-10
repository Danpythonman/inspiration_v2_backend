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
    },
    expiresAt: {
        type: Date,
        // 28,800 seconds in 8 hours
        // By They Said So Quotes API's terms of service (https://theysaidso.com/terms#api)
        // the quotes cannot be stored for more than 8 hours.
        expires: 28_800,
        default: Date.now
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
