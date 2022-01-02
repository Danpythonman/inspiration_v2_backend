const fetch = require("node-fetch");

/**
 * Gets the image of the day from NASA's Astronomy Picture of the Day API
 * (https://data.nasa.gov/Space-Science/Astronomy-Picture-of-the-Day-API/ez2w-t8ua).
 *
 * @returns {Promise} Returns an object containing information about the image returned by the API.
 *                    This contains the URL to the image of the day and other information about the image.
 */
const getImage = async () => {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.IMAGE_API_KEY}`);

    const responseObject = await response.json();

    // We only use these properties of the response object
    return {
        imageUrl: responseObject.hdurl,
        title: responseObject.title,
        photographer: responseObject.copyright,
        description: responseObject.explanation
    };
}

/**
 * Gets the quote of the day from They Said So Quotes API
 * (https://quotes.rest/).
 *
 * @returns {Promise} Returns an object containing the quote of the day, its quote id, and the author of the quote.
 */
 const getQuote = async () => {
    const response = await fetch("https://quotes.rest/qod?category=inspire");

    const responseObject = await response.json();

    // We only use these properties of the response object
    return {
        quoteId: responseObject.contents.quotes[0].id,
        quote: responseObject.contents.quotes[0].quote,
        author: responseObject.contents.quotes[0].author
    };
}

module.exports = {
    getImage,
    getQuote
};
