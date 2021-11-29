const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

// MongoDB connection
logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((e) => logger.error("error connecting to MongoDB", e.message));

/// Middleware
app.use(express.static("build"));
app.use(express.json());
// app.use(cors);

app.use(middleware.requestLogger);

// Router for the notes api
app.use("/api/notes", notesRouter);

// Router for the users api
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
