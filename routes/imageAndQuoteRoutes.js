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

module.exports = router;
