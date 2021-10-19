const express = require('express');

// import all the other routers /tips & /feedback
const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;