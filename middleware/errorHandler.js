const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case VALIDATION_ERROR:
      res.json({
        title: "VALIDATION_ERROR ",
        message: err.message,
        stackTrace: err.stack,
      });

    case UNAUTHORIZED:
      res.json({
        title: "UNAUTHORIZED",
        message: err.message,
        stackTrace: err.stack,
      });

    case FORBIDDEN:
      res.json({
        title: "FORBIDDEN",
        message: err.message,
        stackTrace: err.stack,
      });

    case NOT_FOUND:
      res.json({
        title: "NOT_FOUND",
        message: err.message,
        stackTrace: err.stack,
      });

    case SERVER_ERROR:
      res.json({
        title: "SERVER_ERROR",
        message: err.message,
        stackTrace: err.stack,
      });

    default:
      console.log("NO ERROR FOUND");
      break;
  }
};

module.exports = errorHandler;
