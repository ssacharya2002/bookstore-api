import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";

// Middleware
import { authenticateUser } from "./middleware/auth.js";
import requestLogger from "./middleware/requestLogger.js";

import swaggerSpec from "./swagger.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(cors());

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/books", authenticateUser, booksRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
