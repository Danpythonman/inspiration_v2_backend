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
 *               quoteId:
 *                 type: string
 *               quote:
 *                 type: string
 *               author:
 *                 type: string
 *       404:
 *         description: Quote not found.
 *       500:
 *         description: Internal server error.
 */
 router.get("/quote", imageAndQuoteController.getQuote);

module.exports = router;
