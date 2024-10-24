const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
require("./DBconnection")

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", require("./auth"));
app.use("/api", require("./router"));

module.exports = app;