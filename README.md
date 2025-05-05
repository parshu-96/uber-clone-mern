# Backend API Documentation

## User Registration

### Endpoint

`POST /api/v1/user/register`

### Description

Registers a new user. Requires a valid email, a password (minimum 6 characters), and a first name (minimum 3 characters). Returns a JWT token and the created user object on success.

### Request Body

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `fullName.firstName` (string, required, min 3 chars)
- `fullName.lastName` (string, optional, min 3 chars if provided)
- `email` (string, required, must be a valid email)
- `password` (string, required, min 6 chars)

### Responses

#### 201 Created

User registered successfully.

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### 400 Bad Request

Validation failed.

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Example cURL

```sh
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

---

## User Login

### Endpoint

`POST /api/v1/user/login`

### Description

Authenticates a user using email and password. Returns a JWT token and the user object on successful login.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required, must be a valid email)
- `password` (string, required, min 6 chars)

### Responses

#### 200 OK

User logged in successfully.

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### 400 Bad Request

Validation failed.

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### 401 Unauthorized

Invalid credentials.

```json
{
  "error": "Invalid credentials"
}
```

### Example cURL

```sh
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

---

## Get User Profile

### Endpoint

`GET /api/v1/user/profile`

### Description

Retrieves the profile information for the currently authenticated user. Requires a valid JWT token in the request header.

### Authentication

Requires Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Responses

#### 200 OK

Profile retrieved successfully.

```json
{
  "user": {
    "_id": "user_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### 401 Unauthorized

When token is invalid or missing.

```json
{
  "error": "Unauthorized"
}
```

### Example cURL

Using Bearer token:
```sh
curl -X GET http://localhost:4000/api/v1/user/profile \
  -H "Authorization: Bearer your_jwt_token_here"
```

Using Cookie (cookie is automatically included if you're using the same session):
```sh
curl -X GET http://localhost:4000/api/v1/user/profile \
  --cookie "token=your_jwt_token_here"
```

---

## Logout User

### Endpoint

`GET /api/v1/user/logout`

### Description

Logs out the currently authenticated user by clearing the auth token cookie and blacklisting the current token.

### Authentication

Token can be provided in one of two ways:

1. As a Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

2. OR as an HTTP-only cookie named 'token' (automatically set after login)

Note: You only need to provide the token in one of these ways, not both.

### Responses

#### 200 OK

User successfully logged out.

```json
{
  "message": "Logged out successfully"
}
```

#### 401 Unauthorized

When token is invalid or missing.

```json
{
  "error": "Unauthorized"
}
```

### Example cURL

Using Bearer token:
```sh
curl -X GET http://localhost:4000/api/v1/user/logout \
  -H "Authorization: Bearer your_jwt_token_here"
```

Using Cookie (cookie is automatically included if you're using the same session):
```sh
curl -X GET http://localhost:4000/api/v1/user/logout \
  --cookie "token=your_jwt_token_here"
```