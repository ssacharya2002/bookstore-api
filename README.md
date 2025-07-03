# Bookstore API

**[Link to Test the deployed API via Swagger UI](https://bookstore-api-y7qf.onrender.com/api-docs/)**

A simple Node.js/Express REST API for managing users and books, with authentication, JSON file persistence, and Swagger documentation.

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ssacharya2002/bookstore-api.git
   cd bookstore-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the server:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000` by default.

4. **Environment variables:**
   Create a `.env` file in the project root (optional, but recommended):
   ```env
   # .env example
   JWT_SECRET=your_jwt_secret_key
   BACKEND_URL=your_deployed_url
   ```
   - `JWT_SECRET` is used for signing JWT tokens.
   - `BACKEND_URL` is used by Swagger to set the server URL in the docs (e.g., `http://localhost:5000` or your deployed URL).

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT token

### Books (all require Authorization header)

- `GET /api/books` — List all books (supports `?page=` and `?limit=`)
- `GET /api/books/:id` — Get book by ID
- `POST /api/books` — Add a new book
- `PUT /api/books/:id` — Update a book by ID
- `DELETE /api/books/:id` — Delete a book by ID
- `GET /api/books/search?genre=` — Filter books by genre

---

## How to Test Endpoints

### Using Postman

1. Import the endpoints above into Postman.
2. Register or login to get a JWT token.
3. For all `/api/books` requests, add a header:
   - `Authorization: Bearer <your_token>`

### Using curl

- **Register:**
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123","name":"User"}'
  ```
- **Login:**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123"}'
  ```
- **List books (with token):**
  ```bash
  curl -X GET http://localhost:5000/api/books \
    -H "Authorization: Bearer <your_token>"
  ```

---

## API Documentation (Swagger)

- Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for interactive API docs and testing via Swagger UI.
- Or use the deployed docs: [https://bookstore-api-y7qf.onrender.com/api-docs/](https://bookstore-api-y7qf.onrender.com/api-docs/)

---

## Logging

- All HTTP requests are logged to `logs/logs.json` in JSON format.

---

## License

MIT
