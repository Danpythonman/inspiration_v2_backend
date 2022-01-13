const router = require("express").Router();
const imageAndQuoteController = require("../controllers/imageAndQuoteController");

/**
 * @swagger
 * /image:
 *   get:
 *     tags:
 *       - Image and Quote of the Day
 *     description: Gets the image of the day.
 *     responses:
 *       200:
 *         description: Object containing image URL, title, photographer, and description.
 *         content:
 *           application/json:
 *             schema:
 *               imageUrl:
 *                 type: string
 *               title:
 *                 type: string
 *               photographer:
 *                 type: string
 *               description:
 *                 type: string
 *       404:
 *         description: Image not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/image", imageAndQuoteController.getImage);

/**
 * @swagger
 * /quote:
 *   post:
 *     tags:
 *       - Image and Quote of the Day
 *     description: Adds a quote to the database of quotes.
 *     requestBody:
 *       description: Object quote text and the author of the quote.
 *       required: true
 *         content:
 *           application/json:
 *             schema:
 *               quote:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quote added.
 *       500:
 *         description: Error when adding quote to database or internal server error.
 */
router.post("/quote", imageAndQuoteController.addQuote);

/**
 * @swagger
 * /quote:
 *   get:
 *     tags:
 *       - Image and Quote of the Day
 *     description: Gets the quote of the day.
 *     responses:
 *       200:
 *         description: Object containing quote, its quote id, and the author of the quote.
 *         content:
 *           application/json:
 *             schema:
 *               _id:
 *                 type: string
 *                 format: ObjectId
 *               index:
 *                 type: number
 *               quote:
 *                 type: string
 *               author:
 *                 type: string
 *               quoteOfTheDay:
 *                 type: true
 *       404:
 *         description: Quote not found.
 *       500:
 *         description: Internal server error.
 */
 router.get("/quote", imageAndQuoteController.getQuote);

module.exports = router;
