# Weather Favorites API

Minimal Next.js App Router project in JavaScript with JWT authentication, Open-Meteo weather lookup, and protected in-memory favorites CRUD.

## Stack

- Next.js
- App Router route handlers
- JavaScript only
- bcryptjs
- jsonwebtoken
- Open-Meteo APIs via `fetch`

## Run the app

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
copy .env.local.example .env.local
```

3. Set a JWT secret in `.env.local`:

```env
JWT_SECRET=replace-this-with-a-long-random-secret
```

4. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Weather

- `GET /api/weather?city=Ljubljana`

### Protected favorites

- `GET /api/favorites`
- `POST /api/favorites`
- `PUT /api/favorites/:id`
- `DELETE /api/favorites/:id`

Protected routes require:

```http
Authorization: Bearer <token>
```

## Postman testing

### 1. Register

`POST http://localhost:3000/api/auth/register`

```json
{
  "username": "test",
  "password": "123456"
}
```

### 2. Login

`POST http://localhost:3000/api/auth/login`

```json
{
  "username": "test",
  "password": "123456"
}
```

Copy `data.token` from the response.

### 3. Weather lookup

`GET http://localhost:3000/api/weather?city=Ljubljana`

### 4. Create favorite

`POST http://localhost:3000/api/favorites`

Headers:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "city": "Ljubljana",
  "country": "Slovenia",
  "latitude": 46.0569,
  "longitude": 14.5058
}
```

### 5. List favorites

`GET http://localhost:3000/api/favorites`

### 6. Update favorite

`PUT http://localhost:3000/api/favorites/<id>`

```json
{
  "city": "London",
  "country": "United Kingdom",
  "latitude": 51.5072,
  "longitude": -0.1276
}
```

### 7. Delete favorite

`DELETE http://localhost:3000/api/favorites/<id>`

## Notes

- Data is stored in memory only and resets when the server restarts.
- Favorites are scoped to the authenticated user.
- Missing or invalid Bearer token returns `401`.
- Unknown city returns `404`.
