require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userManagementRoutes = require("./routes/userManagementRoutes");
const imageAndQuoteRoutes = require("./routes/imageAndQuoteRoutes");
const taskManagementRoutes = require("./routes/taskManagementRoutes");

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
});

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(userManagementRoutes);
app.use(imageAndQuoteRoutes);
app.use(taskManagementRoutes);

app.listen(process.env.PORT | 5000, () => {
    console.log(`Listening on PORT ${process.env.PORT | 5000}...`);
});
