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
 *       description: Object containing user's email.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Verification code send to email.
 *       400:
 *         description: Invalid email address.
 *       409:
 *         description: Email already taken or email recently sent for verification.
 *       500:
 *         description: Internal server error
 */
router.post("/signup", userManagementController.signup);

/**
 * @swagger
 * /verify:
 *   post:
 *     tags:
 *       - User Management
 *     description: Verifies a user's email.
 *     requestBody:
 *       description: Object containing user's email, name, and verification code.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             email:
 *               type: string
 *             name:
 *               type: string
 *             verificationCode:
 *               type: string
 *     responses:
 *       200:
 *         description: Email verified, database entry created.
 *       400:
 *         description: Verification code invalid.
 *       404:
 *         description: Verification time limit exceeded, or email has not been registered for verification.
 *       500:
 *         description: Internal server error
 */
router.post("/verify", userManagementController.verifyAccount);

module.exports = router;
