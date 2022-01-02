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

module.exports = {
    getImage
};
