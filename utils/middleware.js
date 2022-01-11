const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method: ", request.method);
  logger.info("Path: ", request.path);
  logger.info("Body: ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      return response
        .status(400)
        .json({ error: error.message, errorName: error.name });
    case "JsonWebTokenError":
      return response.status(401).json({ error: "invalid token" });
    case "TokenExpiredError":
      return response.status(401).json({ error: "token expired" });
    default:
      console.log("There was an unhandled error! Please check");
      next(error);
  }
  logger.error(error.message);

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
};
