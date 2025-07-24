# Natours API (NestJS powered)

_NestJS implementation for the popular tour booking api, converted from Express.js with modern best practices and comprehensive features._

## Table of Contents

- [Natours API (NestJS powered)](#natours-api-nestjs-powered)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [API Documentation](#api-documentation)
  - [Authentication](#authentication)
    - [Default Users (from seed data)](#default-users-from-seed-data)
  - [Database Schema](#database-schema)
    - [Users](#users)
    - [Tours](#tours)
    - [Reviews](#reviews)
    - [Bookings](#bookings)
  - [🔍 API Endpoints](#-api-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Users Endpoints](#users-endpoints)
    - [Tours Endpoints](#tours-endpoints)
    - [Reviews Endpoints](#reviews-endpoints)
    - [Bookings Endpoints](#bookings-endpoints)
  - [Development](#development)
    - [Database Migrations](#database-migrations)
    - [Testing](#testing)
  - [Project Structure](#project-structure)
  - [Security Features](#security-features)
  - [Performance Optimizations](#performance-optimizations)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Complete CRUD operations with profile management
- **Tour Management**: Advanced tour booking system with filtering and pagination
- **Review System**: User reviews with rating calculations
- **Booking System**: Tour booking with payment integration ready
- **API Documentation**: Auto-generated Swagger documentation
- **Database**: PostgreSQL with TypeORM migrations and seeding
- **Validation**: Comprehensive input validation with class-validator and class-transformer
- **Error Handling**: Global exception handling with proper error responses
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Performance**: Compression, caching (via Redis), and optimized queries

## Technologies

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js with JWT strategy
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Environment**: Zod for environment validation
- **Package Manager**: Bun

## Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- PostgreSQL database

## Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:claudiusayadi/natours.git
   cd v2
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**

   ```bash
   # Run migrations
   bun run migration:run

   # Seed the database
   bun run seed
   ```

## Running the Application

```bash
# Development
bun run start:dev

# Production build
bun run build
bun run start:prod
```

The API will be available at `http://localhost:PORT/API_PREFIX`

- PORT and API_PREFIX from your .env
- e.g PORT = 3000, API_PREFIX = 'api/v2'

## API Documentation

Once the application is running, visit `http://localhost:PORT/API_PREFIX/docs` to access the interactive Swagger documentation.

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <access_token>
```

### Default Users (from seed data)

- **Admin**: claudius@natours.live / SayI.Do.Nonsense=God.Punish.Me2025
- **Lead Guide**: lead_guide@natours.live / password123
- **Guide**: guide@natours.live / password123
- **User**: user@natours.live / password123

## Database Schema

### Users

- Authentication and profile management
- Role-based permissions (user, guide, lead-guide, admin)

### Tours

- Tour information with locations and pricing
- Advanced filtering and sorting capabilities

### Reviews

- User reviews with ratings
- Automatic tour rating calculations

### Bookings

- Tour booking management
- Payment integration ready

## 🔍 API Endpoints

### Authentication Endpoints

- `POST /api/v2/auth/register` - User registration
- `POST /api/v2/auth/login` - User login
- `PATCH /api/v2/auth/change-password` - Change password

### Users Endpoints

- `GET /api/v2/users` - Get all users (Admin)
- `GET /api/v2/users/me` - Get current user profile
- `PATCH /api/v2/users/me` - Update current user profile
- `DELETE /api/v2/users/me` - Deactivate account

### Tours Endpoints

- `GET /api/v2/tours` - Get all tours with filtering
- `GET /api/v2/tours/top-5-cheap` - Get top 5 tours
- `GET /api/v2/tours/stats` - Get tour statistics
- `POST /api/v2/tours` - Create tour (Admin/Lead Guide)
- `GET /api/v2/tours/:id` - Get tour by ID
- `PATCH /api/v2/tours/:id` - Update tour (Admin/Lead Guide)
- `DELETE /api/v2/tours/:id` - Delete tour (Admin/Lead Guide)

### Reviews Endpoints

- `GET /api/v2/reviews` - Get all reviews
- `POST /api/v2/reviews` - Create review (only users with confirmed bookings)
- `GET /api/v2/tours/:tourId/reviews` - Get tour reviews
- `POST /api/v2/tours/:tourId/reviews` - Create tour review

### Bookings Endpoints

- `GET /api/v2/bookings` - Get all bookings (Admin/Lead Guide)
- `POST /api/v2/bookings` - Create booking (Admin/Lead Guide)
- `GET /api/v2/bookings/my-bookings` - Get user bookings
- `GET /api/v2/bookings/checkout/:tourId` - Create checkout session

## Development

### Database Migrations

```bash
# Generate migration
bun run migration:generate src/db/migrations/MigrationName

# Run migrations
bun run migration:run

# Revert migration
bun run migration:revert
```

### Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## Project Structure

```tree
src/
├── common/               # Shared utilities
│   ├── decorators/       # Custom decorators
│   ├── enums/            # Enums
│   ├── filters/          # Exception filters
│   ├── guards/           # Guards
│   └── interceptors/     # Interceptors
├── config/               # Configuration
├── database/             # Database related
│   ├── migrations/       # TypeORM migrations
│   └── seeds/            # Database seeds
└── modules/              # Feature modules
    ├── auth/             # Authentication
    ├── users/            # User management
    ├── tours/            # Tour management
    ├── reviews/          # Review system
    └── bookings/         # Booking system
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Comprehensive validation
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: argon2 for password security

## Performance Optimizations

- **Compression**: Response compression
- **Database Indexing**: Optimized database queries
- **Pagination**: Efficient data loading
- **Caching**: Response caching strategies
- **Query Optimization**: TypeORM query optimization

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
6. Would love any collaboration for the frontend app

## License

This project is licensed under the MIT License.

## Author

Claudius A. - Principal Backend Engineer

---

Built with ❤️ using NestJS, TypeScript, and modern best practices.
