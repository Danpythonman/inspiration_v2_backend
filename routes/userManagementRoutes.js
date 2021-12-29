const router = require("express").Router();
const userManagementController = require("../controllers/userManagementController");

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - User Management
 *     description: Creates a user to be verified by email.
 *     requestBody:
 *       description: Object containing user's email and name.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Verification code send to email.
 *       409:
 *         description: Email already taken or email recently sent for verification.
 *       500:
 *         description: Internal server error
 */
router.post("/signup", userManagementController.signup);

module.exports = router;
