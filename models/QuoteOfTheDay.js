const mongoose = require("mongoose");

const QuoteOfTheDaySchema = new mongoose.Schema({
    index: {
        type: Number,
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
    recommender: {
        type: String,
        required: false
    },
    // The quoteOfTheDay property is true for a quote entry if it is the quote
    // being displayed by the frontend for the day, and is false otherwise.
    quoteOfTheDay: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true }
);

/**
 * Quote of the day contains the quote, the author of the quote, and the index of the quote.
 *
 * Timestamps are enabled so the updatedAt property can be used to check if a day has passed
 * since the quote was changed (i.e. quoteOfTheDay set to true), and a new quote of the day can be chosen.
 */
const QuoteOfTheDayModel = mongoose.model("quote", QuoteOfTheDaySchema);

module.exports = QuoteOfTheDayModel;
