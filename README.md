# Event Management API

Simple REST API for managing events and categories.

## Milestone 1 - Basic Setup and Core Features

This milestone includes setting up the Express.js project with TypeScript and creating the foundation for event and category management.

### What We're Building

**Event Management**
- Create new events with details like name, date, location, and capacity
- View all events
- Get individual event details by ID
- Future: Update and delete events

**Category Management**
- Create event categories
- View all categories
- Future: Get, update, and delete categories

### Technologies Used

- Express.js framework
- TypeScript for type safety
- CORS for cross-origin requests
- Morgan for request logging
- Jest for testing
- In-memory storage for now

## Getting Started

Install dependencies:
```
npm install
```

Start the server:
```
npm run dev
```

Server runs on port 3000.

## API Endpoints

**Events:**
- GET /api/v1/events - Get all events
- POST /api/v1/events - Create new event
- GET /api/v1/events/:id - Get event by ID

**Categories:**
- GET /api/v1/categories - Get all categories
- POST /api/v1/categories - Create new category

## Health Check

- GET /health - Check if server is running
