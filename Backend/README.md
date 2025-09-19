# Uber Backend API Documentation

This document provides information about the authentication endpoints available in the Uber Backend API.

## Authentication Endpoints

### User Registration

Register a new user in the system.

**URL**: `/register`

**Method**: `POST`

**Request Body**:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Required Fields**:

- `fullname.firstname` (String, min length: 3 characters)
- `email` (String, valid email format, min length: 5 characters)
- `password` (String, min length: 6 characters)

**Optional Fields**:

- `fullname.lastname` (String, min length: 3 characters if provided)

**Success Response**:

- **Code**: 201 Created
- **Content**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses**:

- **Code**: 400 Bad Request

  - **Content**: `{ "errors": [{ "msg": "Invalid email address", "param": "email", "location": "body" }] }`
  - **When**: Validation errors in the request body

- **Code**: 409 Conflict

  - **Content**: `{ "message": "Email already in use" }`
  - **When**: Email is already registered

- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Registration failed. Please try again." }`
  - **When**: Server encounters an error during registration

---

### User Login

Authenticate a user and get a JWT token.

**URL**: `/login`

**Method**: `POST`

**Request Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Required Fields**:

- `email` (String, valid email format)
- `password` (String, min length: 6 characters)

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses**:

- **Code**: 400 Bad Request

  - **Content**: `{ "errors": [{ "msg": "Invalid email address", "param": "email", "location": "body" }] }`
  - **When**: Validation errors in the request body

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "User dont exist" }`
  - **When**: Email is not registered

- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Invalid Password" }`
  - **When**: Password is incorrect

## Protected Endpoints

### User Profile

Get the profile information of the authenticated user.

**URL**: `/profile`

**Method**: `GET`

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <token>
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses**:

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "No token, authorization denied" }`
  - **When**: No authentication token is provided

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Token is not valid" }`
  - **When**: Invalid token is provided

- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "User not found" }`
  - **When**: User associated with token no longer exists

---

### User Logout

Logout the authenticated user and invalidate the token.

**URL**: `/logout`

**Method**: `GET`

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <token>
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "User logged out"
}
```

**Error Responses**:

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "No token, authorization denied" }`
  - **When**: No authentication token is provided

- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Token is not valid" }`
  - **When**: Invalid token is provided

## Authentication Token

The API uses JWT (JSON Web Token) for authentication. The token is returned upon successful registration and login.

- Token expiration: 1 hour
- Include the token in the Authorization header for protected routes: `Authorization: Bearer <token>`

---

# Captain Endpoints

## Captain Registration

Register a new captain (driver) in the system.

**URL**: `/captain/register`

**Method**: `POST`

**Request Body**:

```json
{
  "fullname": {
    "firstname": "Jane",  // Required, min length: 3 characters
    "lastname": "Smith"   // Optional, min length: 3 characters if provided
  },
  "email": "jane.smith@example.com",  // Required, valid email format
  "password": "securePassword",  // Required, min length: 6 characters
  "vehicle": {
      "plate": "ABC1234",  // Required, min length: 5 characters
      "color": "Red",  // Required, min length: 3 characters
      "vehicleType": "car",  // Required, must be one of: car, bus, truck, scooty
      "capacity": 4  // Required, must be a positive integer (min value: 1)
    },
    "location": {  // Optional
      "lat": 37.7749,  // Optional, latitude coordinate
      "lng": -122.4194  // Optional, longitude coordinate
    },
    "status": "inactive"  // Default value, can be 'active' or 'inactive'
}
```

**Success Response**:

- **Code**: 201 Created
- **Content**:

```json
{
  "success": true,
  "message": "Captain registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token for authentication
  "captain": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "plate": "ABC1234",
      "color": "Red",
      "vehicleType": "car",
      "capacity": 4
    }
  }
}
```

**Error Responses**:

- **Code**: 400 Bad Request

  - **Content**: `{ "success": false, "message": [ { "msg": "Invalid email address", "param": "email", "location": "body" } ] }`
  - **When**: Validation errors in the request body

- **Code**: 400 Bad Request

  - **Content**: `{ "success": false, "message": "Captain already exist" }`
  - **When**: Email is already registered

- **Code**: 500 Internal Server Error
  - **When**: Server encounters an error during registration

## Captain Endpoint Summary

Here's a summary of all captain endpoints:

| Endpoint | Method | Authentication | Description |
|----------|--------|----------------|-------------|
| `/captain/register` | POST | No | Register a new captain |
| `/captain/login` | POST | No | Authenticate a captain and get token |
| `/captain/profile` | GET | Yes | Get the profile of authenticated captain |
| `/captain/logout` | POST | Yes | Logout captain and invalidate token |

**Notes:**
- All authenticated routes require a valid JWT token in the Authorization header as `Bearer <token>`
- Tokens are valid for 24 hours (as defined in the captain model)
- Tokens are automatically blacklisted upon logout to prevent reuse

## Captain Login

Authenticate a captain and get a JWT token.

**URL**: `/captain/login`

**Method**: `POST`

**Request Body**:

```json
{
  "email": "jane.smith@example.com",  // Required, valid email format
  "password": "securePassword"  // Required, min length: 6 characters
}
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token for authentication
  "captain": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "plate": "ABC1234",
      "color": "Red",
      "vehicleType": "car",
      "capacity": 4
    }
  }
}
```

**Error Responses**:

- **Code**: 400 Bad Request

  - **Content**: `{ "errors": [ { "msg": "Invalid email address", "param": "email", "location": "body" } ] }`
  - **When**: Validation errors in the request body

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Invalid email or password" }`
  - **When**: Email is not registered or password is incorrect

## Captain Profile

Get the profile information of the authenticated captain.

**URL**: `/captain/profile`

**Method**: `GET`

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <token>
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "captain": {
    "_id": "60d21b4667d0d8992e610c85",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "plate": "ABC1234",
      "color": "Red",
      "vehicleType": "car",
      "capacity": 4
    }
  }
}
```

**Error Responses**:

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "No token, authorization denied" }`
  - **When**: No authentication token is provided

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Token is blacklisted" }`
  - **When**: Token has been blacklisted (user has logged out)

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Token is not valid" }`
  - **When**: Invalid token is provided

## Captain Logout

Logout the authenticated captain and invalidate the token.

**URL**: `/captain/logout`

**Method**: `POST`

**Authentication**: Required

**Headers**:

```
Authorization: Bearer <token>
```

**Success Response**:

- **Code**: 200 OK
- **Content**:

```json
{
  "message": "Logout successful"
}
```

**Error Responses**:

- **Code**: 400 Bad Request

  - **Content**: `{ "message": "No token provided" }`
  - **When**: No token is found in cookies or Authorization header

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "No token, authorization denied" }`
  - **When**: No authentication token is provided

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Token is blacklisted" }`
  - **When**: Token has already been blacklisted

- **Code**: 401 Unauthorized

  - **Content**: `{ "message": "Token is not valid" }`
  - **When**: Invalid token is provided
