# Capstone Project Proposal: Event Management API

**Student Name:** Krupa Patel  
**Course:** Back-End Development  
**Date:** November 2, 2025  
**Milestone:** Pre-Milestone - Project Planning and Proposal (Module 5)

---

## Project Concept

### Purpose and Theme
I propose to build an **Event Management API** - a back-end system for creating, managing, and organizing events with attendee registration. This API will serve as the backbone for event planning applications, enabling organizers to create events, manage registrations, and track attendees.

### Why This Project?
Event management is a fundamental need across many organizations. By building this API, I can demonstrate proficiency in:
- Data relationships (events, attendees, venues)
- Authentication and authorization scenarios with multiple user roles
- CRUD operations with business logic for event management
- Integration of required course technologies

The project aligns with industry needs and provides practical experience in API development.

---

## Scope and Functionality

### Core API Endpoints

#### Authentication & Users
- `POST /api/auth/register` - User registration (organizer/attendee)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Events
- `GET /api/events` - List public events with filtering
- `POST /api/events` - Create new event (organizers only)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Delete event (organizer only)
- `POST /api/events/:id/publish` - Publish event
- `GET /api/events/my-events` - Get organizer's events

#### Event Registration
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration
- `GET /api/events/:id/attendees` - Get event attendees (organizer only)
- `GET /api/registrations/my-events` - Get user's registered events

### Data Needs
- **Users:** Authentication details, profile information, roles (Admin, Organizer, Attendee)
- **Events:** Event metadata, descriptions, dates, capacity, status
- **Venues:** Venue information, capacity, location
- **Registrations:** Attendee registrations, check-in status

### Key Features

1. **Role-based Access Control** - Different permissions for Admins, Organizers, and Attendees
2. **Event Management** - Create, update, and manage events
3. **Registration System** - Handle attendee registrations and capacity limits
4. **Basic Analytics** - Track registrations and attendance

---

## Course Content Alignment

### Technologies Used (Covered in Course)
- **Node.js & Express.js** - Core server framework and routing
- **Firebase Authentication** - User authentication with custom claims
- **Firestore Database** - NoSQL database for data persistence
- **Jest Testing** - Unit and integration testing
- **Swagger/OpenAPI** - API documentation
- **GitHub Actions** - CI/CD pipeline
- **Deployment** - Using Render or Railway

### Course Concepts Applied
- **RESTful API Design** - Following REST principles for all endpoints
- **Authentication & Authorization** - Firebase auth with role-based permissions
- **Database Design** - Structured data models with relationships
- **Error Handling** - Comprehensive error responses and logging
- **Testing Strategies** - Unit tests, integration tests, and API testing
- **Documentation** - Complete API documentation with Swagger

---

## GitHub Project Setup

### Repository Structure

```
event-management-api/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── tests/
├── docs/
├── .github/workflows/
└── config/
```

### Project Board Organization

#### Milestones

1. **Pre-Milestone: Planning and Proposal** (Week 0)
2. **Milestone 1: Setup and Basic CRUD Implementation** (Weeks 1-2)
3. **Milestone 2: Sprint Demo and Component Integration** (Week 3)
4. **Milestone 3: Final Project and Component Implementation** (Weeks 4-5)
5. **Final Project Demonstration** (Week 5)

#### High-Level Tasks by Milestone

**Pre-Milestone: Planning and Proposal (Week 0)**

- Complete project proposal document
- Set up GitHub repository
- Create project board with initial planning
- Research and plan technology stack

**Milestone 1: Setup and Basic CRUD Implementation (Weeks 1-2)**

- Initialize Node.js project with dependencies
- Set up Express.js server structure
- Configure Firebase project and Firestore
- Implement Firebase Authentication integration
- Create user registration and login endpoints
- Set up custom claims for role-based authorization
- Create basic Event CRUD endpoints
- Implement user profile management
- Set up basic API testing structure

**Milestone 2: Sprint Demo and Component Integration (Week 3)**

- Complete event registration system
- Implement role-based permissions
- Add event capacity and registration limits
- Create attendee management features
- Prepare sprint demonstration
- Document current progress and features

**Milestone 3: Final Project and Component Implementation (Weeks 4-5)**

- Complete all remaining API endpoints
- Write comprehensive unit tests with Jest
- Create integration tests for API endpoints
- Set up GitHub Actions for CI/CD
- Generate Swagger/OpenAPI documentation
- Deploy application to cloud platform
- Implement proper logging and error handling
- Finalize all features and documentation
- Prepare final project demonstration

### Git Workflow Standards

- **Main Branch:** Production-ready code
- **Development Branch:** Integration branch for features
- **Feature Branches:** Individual feature development
- **Naming Convention:** `feature/task-description`, `bugfix/issue-description`

---

## Success Criteria

This project will be considered successful when:

1. All API endpoints are functional and properly tested
2. Authentication and authorization work correctly for all user roles (Admin, Organizer, Attendee)
3. Event registration system handles capacity limits and user management effectively
4. Comprehensive test coverage (>80%) with passing CI/CD pipeline
5. Complete API documentation accessible through Swagger UI
6. Successful deployment with proper environment configuration
7. Clean, maintainable code following industry best practices

---

## Timeline

**Total Duration:** 5 weeks (with Week 0 for planning)  
**Expected Completion:** December 7, 2025

This proposal outlines a back-end project that demonstrates mastery of course concepts through practical event management functionality. The Event Management API provides real-world experience in API development, authentication, and database management using industry-standard technologies.