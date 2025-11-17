# Event Management API

A REST API for managing events and categories. Built with Express and TypeScript for my backend development course.

## Milestone 1:

What I've finished:
- Set up the development environment with TypeScript and Express
- Created 10 API endpoints for events and categories (full CRUD)
- Added Swagger documentation so you can test the API in your browser
- Made a plan for adding node-cron later (see new-component-plan.md)
- Wrote 86 tests and they all pass

## Project Structure

```
src/
├── app.ts                   # Express app setup
├── server.ts                # Starts the server
├── constants/               # HTTP status codes
├── data/                    # Arrays to store data (for now)
├── api/v1/
│   ├── models/              # TypeScript interfaces
│   ├── controllers/         # Handle requests
│   ├── services/            # Business logic
│   └── routes/              # API endpoints
tests/
├── unit/                    # Tests for services and controllers
└── integration/             # Tests for routes
```

## What It Does

**Events:**
- Create, read, update, and delete events
- Each event has name, date, location, capacity, description, and status

**Categories:**
- Create, read, update, and delete categories
- Categories have a name and description

**Swagger Docs:**
- Go to http://localhost:3000/api-docs to see all endpoints
- You can test the API right in your browser

## How to Run It

**Install dependencies:**
```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Test Results:**
- 43 tests passing
- Coverage: >65% (exceeds Milestone 1 requirement)
- Unit tests: Event & Category services fully covered
- Integration tests: API endpoints tested

## API Endpoints

**Events:**
- GET `/api/v1/events` - Get all events
- GET `/api/v1/events/:id` - Get one event
- POST `/api/v1/events` - Create an event
- PUT `/api/v1/events/:id` - Update an event
- DELETE `/api/v1/events/:id` - Delete an event

**Categories:**
- GET `/api/v1/categories` - Get all categories
- GET `/api/v1/categories/:id` - Get one category
- POST `/api/v1/categories` - Create a category
- PUT `/api/v1/categories/:id` - Update a category
- DELETE `/api/v1/categories/:id` - Delete a category

**Other:**
- GET `/api-docs` - Swagger documentation
- GET `/health` - Check if server is running

## Examples

Create an event:
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-12-15",
    "location": "Main Auditorium",
    "capacity": 500
  }'
```

Get all events:
```bash
curl http://localhost:3000/api/v1/events
```

## Tech Stack

- Express.js - Web framework
- TypeScript - For type safety
- Swagger - API documentation
- Jest - Testing
- Morgan - Logging HTTP requests
- CORS - Handle cross-origin requests

