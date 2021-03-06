const databaseService = require("../services/databaseService");
const imageAndQuoteApiService = require("../services/imageAndQuoteApiService");

const getImage = async (req, res) => {
    try {
        let imageOfTheDay = await databaseService.getImageOfTheDay();
        // If image of the day does not exist in the database, then get image from API and set it in database
        if (!imageOfTheDay) {
            const imageOfTheDayObject = await imageAndQuoteApiService.getImage();

            imageOfTheDay = await databaseService.createImageOfTheDay(imageOfTheDayObject);
        }

        const timeSinceImageUpdate = Date.now() - imageOfTheDay.updatedAt.getTime();

        // There are 86,400,000 milliseconds in a day.
        // So, if 86,400,000 milliseconds have passed since the last image update,
        // then a day has passed since the last image update and a new image can be retrieved.
        if (timeSinceImageUpdate > 86_400_000) {
            const newImageOfTheDay = await imageAndQuoteApiService.getImage();

            // If the new image is not the same as the current image, then update the
            // image of the day in the database
            if (imageOfTheDay.imageUrl !== newImageOfTheDay.imageUrl) {
                imageOfTheDay = await databaseService.setImageOfTheDay(imageOfTheDay.imageUrl, newImageOfTheDay);
            }
        }

        if (!imageOfTheDay) {
            res.status(404).send("Image not found");
            return;
        }

        res.status(200).send(imageOfTheDay);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const addQuote = async (req, res) => {
    try {
        const numberOfQuotes = await databaseService.getNumberOfQuotes();

        // Number of quotes currently in the database supplied as an argument so that
        // we know what index to give the new quote.
        const newQuote = await databaseService.addQuote(
            req.body.quote,
            req.body.author,
            numberOfQuotes,
            req.body.recommender ? req.body.recommender : null
        );

        if (!newQuote) {
            res.status(500).send("Quote was not added");
        }

        res.status(200).send("Quote added");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getQuote = async (req, res) => {
    try {
        let quoteOfTheDay = await databaseService.getQuoteOfTheDay();

        const timeSinceQuoteUpdate = Date.now() - quoteOfTheDay.updatedAt.getTime();

        // There are 86,400,000 milliseconds in a day.
        // So, if 86,400,000 milliseconds have passed since the last quote update,
        // then a day has passed since the last quote update and a new quote can be retrieved.
        if (timeSinceQuoteUpdate > 86_400_000) {
            const numberOfQuotes = await databaseService.getNumberOfQuotes();

            // Random integer between 0 and the number of quotes
            // (0 inclusive, number of quotes exclusive).
            // The quote document at the index of this random number will be the
            // new quote of the day.
            const indexOfNewQuoteOfTheDay = Math.floor(Math.random() * numberOfQuotes);

            await databaseService.unsetQuoteOfTheDay();

            quoteOfTheDay = await databaseService.setQuoteOfTheDay(indexOfNewQuoteOfTheDay);
        }

        if (!quoteOfTheDay) {
            res.status(404).send("Quote not found");
            return;
        }

        res.status(200).send(quoteOfTheDay);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getImage,
    addQuote,
    getQuote
};
