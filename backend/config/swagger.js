const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wa-Kriti API',
      version: '1.0.0',
      description: 'Enterprise Bamboo E-Commerce Platform API Documentation',
    },
    servers: [
      { url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/${process.env.API_VERSION || 'v1'}` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
