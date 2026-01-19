# ScaleSite API Documentation

**Version**: 1.0.0
**Base URL**: `http://localhost:3001/api`
**Content Type**: `application/json`

## Authentication

Most endpoints require authentication using JWT tokens.

### Authentication Methods

1. **JWT Token** (Primary)
   - Header: `Authorization: Bearer <token>`
   - Lifetime: 1 hour (access token)

2. **Session Cookie** (Alternative)
   - Automatically managed by server
   - Lifetime: Session-based

3. **OAuth2** (Social Login)
   - Supported providers: GitHub, Google
   - Flow: Authorization Code Grant

---

## API Endpoints

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "company": "Example Corp"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Email already exists"
}
```

#### POST `/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/logout`
Logout current user.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/auth/me`
Get current user information.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### POST `/auth/refresh`
Refresh access token.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

### User Endpoints

#### GET `/users`
Get all users (admin only).

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200 OK):
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET `/users/:id`
Get user by ID.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### PUT `/users/:id`
Update user profile.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "John Smith",
  "company": "New Company"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Smith",
    "company": "New Company",
    "role": "user"
  }
}
```

---

### Project Endpoints

#### GET `/projects`
Get all projects for current user.

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): Filter by status (`draft`, `active`, `completed`, `on_hold`)

**Response** (200 OK):
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj_123",
      "name": "My Website",
      "description": "A new website",
      "status": "active",
      "createdAt": "2024-01-19T10:00:00Z"
    }
  ]
}
```

#### POST `/projects`
Create a new project.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "My Website",
  "description": "A new website",
  "type": "landing-page"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Project created",
  "project": {
    "id": "proj_123",
    "name": "My Website",
    "description": "A new website",
    "status": "draft",
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### GET `/projects/:id`
Get project by ID.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "project": {
    "id": "proj_123",
    "name": "My Website",
    "description": "A new website",
    "status": "active",
    "milestones": [
      {
        "id": "milestone_1",
        "title": "Design Phase",
        "status": "completed"
      }
    ],
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### PUT `/projects/:id`
Update project.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Project updated",
  "project": {
    "id": "proj_123",
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "active"
  }
}
```

#### DELETE `/projects/:id`
Delete project.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Project deleted"
}
```

---

### Ticket Support Endpoints

#### GET `/tickets`
Get all tickets.

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): Filter by status (`open`, `in_progress`, `pending`, `resolved`, `closed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `urgent`)

**Response** (200 OK):
```json
{
  "success": true,
  "tickets": [
    {
      "id": "ticket_123",
      "subject": "Need help with setup",
      "description": "I need help setting up my project",
      "status": "open",
      "priority": "medium",
      "userId": "user_123",
      "createdAt": "2024-01-19T10:00:00Z"
    }
  ]
}
```

#### POST `/tickets`
Create a new ticket.

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "subject": "Need help with setup",
  "description": "I need help setting up my project",
  "priority": "medium"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Ticket created",
  "ticket": {
    "id": "ticket_123",
    "subject": "Need help with setup",
    "description": "I need help setting up my project",
    "status": "open",
    "priority": "medium",
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### POST `/tickets/:id/messages`
Add a message to a ticket.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body** (form-data):
```
message: I'm still having issues
file: [optional file attachment]
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Message added",
  "ticketMessage": {
    "id": "msg_123",
    "ticketId": "ticket_123",
    "userId": "user_123",
    "message": "I'm still having issues",
    "createdAt": "2024-01-19T10:00:00Z"
  }
}
```

#### GET `/tickets/:id/messages`
Get all messages for a ticket.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_123",
      "ticketId": "ticket_123",
      "userId": "user_123",
      "message": "I'm still having issues",
      "createdAt": "2024-01-19T10:00:00Z"
    }
  ]
}
```

---

### Newsletter Endpoints

#### GET `/newsletter/subscribers`
Get all subscribers.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "subscribers": [
    {
      "id": "sub_123",
      "email": "subscriber@example.com",
      "status": "active",
      "subscribedAt": "2024-01-19T10:00:00Z"
    }
  ]
}
```

#### POST `/newsletter/subscribe`
Subscribe to newsletter.

**Request Body**:
```json
{
  "email": "subscriber@example.com"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Successfully subscribed",
  "subscriber": {
    "id": "sub_123",
    "email": "subscriber@example.com",
    "status": "active",
    "subscribedAt": "2024-01-19T10:00:00Z"
  }
}
```

#### POST `/newsletter/unsubscribe`
Unsubscribe from newsletter.

**Request Body**:
```json
{
  "email": "subscriber@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully unsubscribed"
}
```

---

### File Upload Endpoints

#### POST `/upload`
Upload a file.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body** (form-data):
```
file: [file]
type: [optional file type: image, document, etc.]
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "File uploaded",
  "file": {
    "url": "/uploads/image-123.jpg",
    "filename": "image-123.jpg",
    "size": 102400,
    "mimetype": "image/jpeg"
  }
}
```

---

## Error Responses

All endpoints may return error responses.

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse.

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642579200
```

---

## WebSocket API

Real-time updates are available via WebSocket.

### Connection

**URL**: `ws://localhost:3001`

### Authentication

Send authentication message after connecting:

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Events

#### ticket:update
```json
{
  "type": "ticket.update",
  "data": {
    "ticketId": "ticket_123",
    "status": "in_progress"
  }
}
```

#### notification:new
```json
{
  "type": "notification.new",
  "data": {
    "title": "New Message",
    "message": "You have a new message",
    "link": "/tickets/ticket_123"
  }
}
```

---

## Testing

Use the provided `curl` examples for testing:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Projects
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer <token>"

# Create Ticket
curl -X POST http://localhost:3001/api/tickets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Help needed","description":"I need help","priority":"medium"}'
```

---

## Changelog

### Version 1.0.0 (2024-01-19)
- Initial API release
- Authentication endpoints
- User management
- Project management
- Ticket support system
- Newsletter subscription
- File upload
- WebSocket support
