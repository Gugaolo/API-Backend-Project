# API Backend Project

Node.js + Express backend with JWT authentication and REST Countries API integration.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /api/register** - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Returns: JWT token and user data

- **POST /api/login** - Login with existing credentials
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: JWT token and user data

### Protected Endpoints (require Bearer token)

- **GET /api/profile** - Get current user's profile
  - Header: `Authorization: Bearer <token>`

- **GET /api/countries?name={name}** - Search countries by name
  - Header: `Authorization: Bearer <token>`
  - Query: `name` - Country name to search for
  - Returns: Simplified country data from REST Countries API

### Health Check

- **GET /health** - Server health status

## Postman Collection

The Postman collection is located in `postman/collections/API Backend/` with the following requests:
- Register
- Login
- Profile
- Countries Search

Each request includes tests that validate responses and automatically capture the JWT token for reuse.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT signing (default: 'your-secret-key-change-in-production')
