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

module.exports = {
    getImage
};
