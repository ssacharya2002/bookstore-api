import swaggerJSDoc from "swagger-jsdoc";

import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Bookstore API",
        version: "1.0.0",
        description: "API documentation for the Bookstore project",
      },
      servers: [
        { url: process.env.BACKEND_URL },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        { bearerAuth: [] },
      ],
    },
    apis: ["./src/routes/*.js"],
  };
  
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
