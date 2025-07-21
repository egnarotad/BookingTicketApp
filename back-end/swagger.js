const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Phiên bản OpenAPI
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for Node.js Express API',
    },
    servers: [
      {
        url: 'http://localhost:9999',
      },
    ],
  },
  // Đường dẫn tới các file chứa annotation (JSDoc comments)
  apis: ['./routes/*.js'], // Bạn để đường dẫn tới các route files có chứa comment
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
