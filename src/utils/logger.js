import { createLogger, format, transports } from "winston";
import path from "path";

// Log file path
const logFilePath = path.join("logs", "logs.json");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json() 
  ),
  transports: [new transports.File({ filename: logFilePath })],
});

export default logger;
