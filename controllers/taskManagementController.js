const databaseService = require("../services/databaseService");

const addTask = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const taskUser = await databaseService.addTask(req.token.email, req.body.task);
        if (!taskUser) {
            // This is probably not a 404 error because the user had to be found
            // in the database to pass the JWT middlewear to get to this function.
            res.status(500).send(err.message);
            return;
        }

        // Since every task in the database is base64 encoded, we convert them to utf-8 before sending to user.
        taskUser.tasks.forEach(task => task.content = Buffer.from(task.content, "base64").toString("utf-8"));

        res.status(200).send(taskUser.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getTasks = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear.
        // Since every task in the database is base64 encoded, we convert them to utf-8 before sending to user.
        req.body.user.tasks.forEach(task => task.content = Buffer.from(task.content, "base64").toString("utf-8"));

        res.status(200).send(req.body.user.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const updateTask = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const updateTaskUser = await databaseService.updateTask(req.token.email, req.body.taskId, req.body.task);
        if (!updateTaskUser) {
            // This is probably not a 404 error because the user had to be found
            // in the database to pass the JWT middlewear to get to this function.
            res.status(500).send(err.message);
            return;
        }

        // Since every task in the database is base64 encoded, we convert them to utf-8 before sending to user.
        updateTaskUser.tasks.forEach(task => task.content = Buffer.from(task.content, "base64").toString("utf-8"));

        res.status(200).send(updateTaskUser.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const updateTaskCompletion = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const updateTaskCompletionUser = await databaseService.updateTaskCompletion(req.token.email, req.body.taskId, req.body.completed);
        if (!updateTaskCompletionUser) {
            // This is probably not a 404 error because the user had to be found
            // in the database to pass the JWT middlewear to get to this function.
            res.status(500).send(err.message);
            return;
        }

        // Since every task in the database is base64 encoded, we convert them to utf-8 before sending to user.
        updateTaskCompletionUser.tasks.forEach(task => task.content = Buffer.from(task.content, "base64").toString("utf-8"));

        res.status(200).send(updateTaskCompletionUser.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const deleteTask = async (req, res) => {
    try {
        // req.token and req.body.user are created by the jwtController middlewear
        const deleteTaskUser = await databaseService.deleteTask(req.token.email, req.body.taskId);
        if (!deleteTaskUser) {
            // This is probably not a 404 error because the user had to be found
            // in the database to pass the JWT middlewear to get to this function.
            res.status(500).send(err.message);
            return;
        }

        // Since every task in the database is base64 encoded, we convert them to utf-8 before sending to user.
        deleteTaskUser.tasks.forEach(task => task.content = Buffer.from(task.content, "base64").toString("utf-8"));

        res.status(200).send(deleteTaskUser.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    addTask,
    getTasks,
    updateTask,
    updateTaskCompletion,
    deleteTask
};
