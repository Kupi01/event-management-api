import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'REST API for managing events, categories, and attendees. Built with Express.js, TypeScript, and Firebase Firestore.',
      contact: {
        name: 'Krupa Patel',
        email: 'support@eventmanagement.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Events',
        description: 'Event management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Attendees',
        description: 'Attendee management endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: [
    './src/api/v1/routes/*.ts',
    './src/api/v1/validations/*.ts',
    './src/app.ts'
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
