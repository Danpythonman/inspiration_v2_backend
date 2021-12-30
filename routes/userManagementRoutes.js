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
 * /signup/verify:
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
 *       201:
 *         description: Email verified, database entry created and auth and refresh tokens sent.
 *       400:
 *         description: Verification code invalid.
 *       404:
 *         description: Verification time limit exceeded, or email has not been registered for verification.
 *       500:
 *         description: Internal server error
 */
router.post("/signup/verify", userManagementController.verifySignup);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User Management
 *     description: Sends email with verification code to log in.
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
 *       404:
 *         description: No user with specified email found.
 *       409:
 *         description: Email already taken or email recently sent for verification.
 *       500:
 *         description: Internal server error
 */
router.post("/login", userManagementController.login);

/**
 * @swagger
 * /login/verify:
 *   post:
 *     tags:
 *       - User Management
 *     description: Verifies a login request.
 *     requestBody:
 *       description: Object containing user's email and verification code.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             email:
 *               type: string
 *             verificationCode:
 *               type: string
 *     responses:
 *       200:
 *         description: Email verified, auth and refresh tokens sent.
 *       400:
 *         description: Verification code invalid.
 *       404:
 *         description: Verification time limit exceeded, email has not been registered for verification, or user with specified email not found.
 *       500:
 *         description: Internal server error
 */
router.post("/login/verify", userManagementController.verifyLogin);

/**
 * @swagger
 * /refresh:
 *   post:
 *     tags:
 *       - User Management
 *     description: Verifies refresh token and sends new auth token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Refresh token valid, new auth token sent.
 *       401:
 *         description: Unauthorized. No refresh token sent or refresh token invalid.
 *       404:
 *         description: User specified by email in refresh token payload not found.
 *       500:
 *         description: Internal server error
 */
router.post("/refresh", userManagementController.refresh);

module.exports = router;
