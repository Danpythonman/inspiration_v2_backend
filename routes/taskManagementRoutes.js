const router = require("express").Router();
const jwtController = require("../controllers/jwtController");
const taskManagementController = require("../controllers/taskManagementController");

/**
 * @swagger
 * /task:
 *   post:
 *     tags:
 *       - Task Management
 *     description: Adds a task to the task list of the user specified in the auth token sent.
 *     requestBody:
 *       description: Object containing the task to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             task:
 *               type: string
 *     responses:
 *       200:
 *         description: Object containing array of the user's tasks, including the newly added task.
 *         content:
 *           application/json:
 *             schema:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     content:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when adding task.
 */
router.post("/task", jwtController.verifyAuthToken, taskManagementController.addTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Task Management
 *     description: Gets the task list of the user specified in the auth token sent.
 *     responses:
 *       200:
 *         description: Object containing array of the user's tasks.
 *         content:
 *           application/json:
 *             schema:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     content:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/tasks", jwtController.verifyAuthToken, taskManagementController.getTasks);

/**
 * @swagger
 * /task:
 *   put:
 *     tags:
 *       - Task Management
 *     description: Updates the content of a task in the task list of the user specified in the auth token sent.
 *     requestBody:
 *       description: Object containing the _id of the task to update and the new value of its content.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             taskId:
 *               type: string
 *               format: ObjectId
 *             task:
 *               type: string
 *     responses:
 *       200:
 *         description: Object containing array of the user's tasks, including the newly updated task.
 *         content:
 *           application/json:
 *             schema:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     content:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when updating task.
 */
router.put("/task", jwtController.verifyAuthToken, taskManagementController.updateTask);

/**
 * @swagger
 * /task/complete:
 *   put:
 *     tags:
 *       - Task Management
 *     description: Updates the completion status of a task in the task list of the user specified in the auth token sent.
 *     requestBody:
 *       description: Object containing the _id of the task to update and its new completion status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             taskId:
 *               type: string
 *               format: ObjectId
 *             completed:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Object containing array of the user's tasks, including the newly updated completion status of the task.
 *         content:
 *           application/json:
 *             schema:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     content:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/task/complete", jwtController.verifyAuthToken, taskManagementController.updateTaskCompletion);

/**
 * @swagger
 * /task:
 *   delete:
 *     tags:
 *       - Task Management
 *     description: Deletes a task from the task list of the user specified in the auth token sent.
 *     requestBody:
 *       description: Object containing the _id of the task to be deleted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             taskId:
 *               type: string
 *               format: ObjectId
 *     responses:
 *       200:
 *         description: Object containing array of the user's tasks, without the newly deleted task.
 *         content:
 *           application/json:
 *             schema:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     content:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. No auth token sent or auth token invalid.
 *       404:
 *         description: User specified by email in auth token payload not found.
 *       500:
 *         description: Internal server error or error when deleting task.
 */
router.delete("/task", jwtController.verifyAuthToken, taskManagementController.deleteTask);

module.exports = router;
