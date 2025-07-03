import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.originalUrl,
    message: `${req.method} ${req.originalUrl}`,
  });
  next();
};

export default requestLogger;
