const router = require("express").Router();
const userManagementController = require("../controllers/userManagementController");
const jwtController = require("../controllers/jwtController");

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
 *         description: Verification code invalid or the verification request's verification type is not signup.
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
 *         description: Email verified, auth and refresh tokens sent, along with user's name and email.
 *         content:
 *           application/json:
 *             schema:
 *               auth:
 *                 type: string
 *               refresh:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *       400:
 *         description: Verification code invalid or the verification request's verification type is not login.
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
router.post("/refresh", jwtController.verifyRefreshToken, userManagementController.refresh);

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User Management
 *     description: Retrieves the name and email of the user specified in the auth token sent.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Object containing the name, email, and color of the user.
 *         content:
 *           application/json:
 *             schema:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error
 */
router.get("/user", jwtController.verifyAuthToken, userManagementController.getNameAndEmail);

/**
 * @swagger
 * /name:
 *   put:
 *     tags:
 *       - User Management
 *     description: Changes the name of the user specified by the email in the payload of the auth token sent.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing user's updated name.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             updatedName:
 *               type: string
 *     responses:
 *       200:
 *         description: Name changed successfully.
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when updating user's name.
 */
router.put("/name", jwtController.verifyAuthToken, userManagementController.changeName);

/**
 * @swagger
 * /color:
 *   put:
 *     tags:
 *       - User Management
 *     description: Changes the color of the user's to-do list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing user's updated color.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             updatedColor:
 *               type: string
 *     responses:
 *       200:
 *         description: Color changed successfully.
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when updating user's name.
 */
router.put("/color", jwtController.verifyAuthToken, userManagementController.changeColor);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - User Management
 *     description: >-
 *       Changes the secret hashes for auth and refresh tokens in the user's database entry,
 *       which renders all pre-existing auth and refresh tokens invalid,
 *       effectively logging out of all devices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out of all devices.
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when updating user's secret hashes.
 */
router.post("/logout", jwtController.verifyAuthToken, userManagementController.revokeTokens);

/**
 * @swagger
 * /delete:
 *   post:
 *     tags:
 *       - User Management
 *     description: >-
 *       Sends and email to the user to confirm their account deletion.
 *       User to be deleted is specified by email in the payload of the auth token sent.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification code sent to email.
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       409:
 *         description: Verification email recently sent.
 *       500:
 *         description: Internal server error
 */
router.post("/delete", jwtController.verifyAuthToken, userManagementController.requestDelete);

/**
 * @swagger
 * /delete/verify:
 *   delete:
 *     tags:
 *       - User Management
 *     description: >-
 *       Deletes user in database.
 *       User to be deleted is specified by email in the payload of the auth token sent.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing verification code.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             verificationCode:
 *               type: string
 *     responses:
 *       200:
 *         description: User deleted.
 *       400:
 *         description: Verification code invalid or the verification request's verification type is not delete.
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/verify", jwtController.verifyAuthToken, userManagementController.verifyDelete);

module.exports = router;
