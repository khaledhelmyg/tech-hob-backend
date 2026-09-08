# 🚀 TechHub Backend

A production-oriented **RESTful API** for a technology blogging and events platform, built with **Node.js, Express.js, and MongoDB**.

TechHub provides the backend services required to manage users, authentication, blog posts, events, categories, reviews, file uploads, and email notifications through a structured and modular API.

## ✨ Features

### 🔐 Authentication & Authorization

* User registration
* User login/logout
* JWT-based authentication
* HTTP cookie-based authentication
* Password hashing with bcrypt
* Password reset flow
* Role-based authorization
* Protected API routes

### 📝 Blog Management

* Create blog posts
* Update blog posts
* Delete blog posts
* Retrieve a single post
* Retrieve multiple posts
* Image uploads
* Search and filtering
* Pagination

### 📅 Event Management

* Create events
* Retrieve events
* Retrieve a single event
* Event registration
* Event-related reviews

### 🏷️ Categories

* Create categories
* Organize posts by categories
* Category filtering and search

### ⭐ Reviews

* Review posts and events
* Manage review-related resources
* Associate reviews with authenticated users

### 📁 File Uploads

The application supports image/file uploads using:

* Google Cloud Storage
* Cloudinary
* Multer

### 📧 Email Notifications

Email functionality is implemented using:

* Nodemailer
* Pug email templates

Used for flows such as password reset and other system notifications.

---

# 🛠️ Tech Stack

| Technology           | Purpose            |
| -------------------- | ------------------ |
| Node.js              | Runtime            |
| Express.js           | REST API framework |
| MongoDB              | Database           |
| Mongoose             | MongoDB ODM        |
| JWT                  | Authentication     |
| bcrypt               | Password hashing   |
| Multer               | File uploads       |
| Google Cloud Storage | File storage       |
| Cloudinary           | Media storage      |
| Nodemailer           | Email delivery     |
| Pug                  | Email templates    |
| Postman              | API testing        |

---

# 🏗️ Architecture

The project follows a modular Express.js architecture that separates HTTP handling, business logic, persistence, and infrastructure concerns.

```text
Client
  │
  ▼
Express Router
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Authorization
  ├── Validation
  └── Error Handling
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ├── Business Logic
  ├── File Storage
  └── Email Services
  │
  ▼
Models
  │
  ▼
MongoDB
```

External services:

```text
                 ┌── Google Cloud Storage
                 │
API ── Services ─┼── Cloudinary
                 │
                 └── Email / Nodemailer
```

---

# 📁 Project Structure

```text
tech-hob-backend/
│
├── config/
│   └── Application configuration
│
├── controllers/
│   └── HTTP request handlers
│
├── docs/
│   └── Project documentation
│
├── errors/
│   └── Custom error handling
│
├── middlewares/
│   └── Authentication, authorization,
│       validation and request middleware
│
├── models/
│   └── Mongoose database models
│
├── routes/
│   └── API route definitions
│
├── services/
│   └── Business and external-service logic
│
├── utilities/
│   └── Shared helper functions
│
├── views/
│   └── emails/
│       └── Pug email templates
│
├── app.js
├── package.json
├── package-lock.json
└── TechHub.postman_collection.json
```

This separation makes the codebase easier to maintain and allows business logic and infrastructure integrations to evolve independently. The repository currently follows this structure with dedicated directories for configuration, controllers, services, models, routes, middleware, errors, utilities, and email views.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 14+
* npm
* MongoDB
* Google Cloud Storage and/or Cloudinary credentials
* SMTP/email credentials

> For new development environments, using a currently supported Node.js LTS release is recommended.

## 1. Clone the repository

```bash
git clone https://github.com/khaledhelmyg/tech-hob-backend.git

cd tech-hob-backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create the required environment configuration file based on the project's configuration template.

Example:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_BUCKET=your_bucket_name
```

> Use the exact variable names expected by the application's configuration files. Never commit real credentials to Git.

## 4. Start the development server

```bash
npm run start:dev
```

The API will start using the project's Express application configuration.

---

# 🔐 Authentication Flow

TechHub uses JWT-based authentication with cookies.

```text
Client
  │
  │ POST /auth/login
  ▼
Authentication Controller
  │
  ├── Validate credentials
  │
  ├── Verify password
  │
  └── Generate JWT
  │
  ▼
HTTP Cookie
  │
  ▼
Authenticated Requests
```

Protected endpoints verify the user's authentication state before allowing access to restricted resources.

---

# 🌐 API

The API is versioned under:

```text
/api/v1
```

## Authentication

| Method | Endpoint                              | Description            |
| ------ | ------------------------------------- | ---------------------- |
| POST   | `/api/v1/auth/register`               | Register a new user    |
| POST   | `/api/v1/auth/login`                  | Authenticate user      |
| POST   | `/api/v1/auth/logout`                 | Logout                 |
| POST   | `/api/v1/auth/forgot-password`        | Request password reset |
| PATCH  | `/api/v1/users/reset-password/:token` | Reset password         |

## Users

| Method | Endpoint                           | Description      |
| ------ | ---------------------------------- | ---------------- |
| GET    | `/api/v1/users/getuser/:id`        | Get user profile |
| PATCH  | `/api/v1/users/updateProfile/:id`  | Update profile   |
| PUT    | `/api/v1/users/updatePassword/:id` | Update password  |

## Posts

| Method | Endpoint                   | Description |
| ------ | -------------------------- | ----------- |
| GET    | `/api/v1/posts`            | Get posts   |
| POST   | `/api/v1/posts`            | Create post |
| GET    | `/api/v1/posts/:id`        | Get post    |
| PUT    | `/api/v1/posts/update/:id` | Update post |
| DELETE | `/api/v1/posts/delete/:id` | Delete post |

Post endpoints support authentication for protected operations, along with pagination, filtering, and search functionality.

## Events

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/v1/event`     | Get events         |
| POST   | `/api/v1/event`     | Create event       |
| GET    | `/api/v1/event/:id` | Get event          |
| PATCH  | `/api/v1/event/:id` | Register for event |

## Categories

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | `/api/v1/category/create` | Create category |

## Reviews

Reviews are supported for posts and events.

For the complete review API, see the route definitions and included Postman collection.

---

# 📮 Postman Collection

The repository includes a ready-to-use Postman collection:

```text
TechHub.postman_collection.json
```

Import the collection into Postman to explore and test the API.

Recommended environment variables:

```text
BASE_URL
TOKEN
```

Example:

```text
BASE_URL=http://localhost:5000/api/v1
```

---

# 📤 File Upload Architecture

The API supports media uploads through Multer and external cloud storage providers.

```text
Client
  │
  │ Multipart/Form-Data
  ▼
Multer
  │
  ▼
Service Layer
  │
  ├── Cloudinary
  │
  └── Google Cloud Storage
  │
  ▼
Stored File URL
  │
  ▼
MongoDB Document
```

This keeps binary files outside the database while storing the required metadata/reference in MongoDB.

---

# 📧 Email System

Email functionality is handled through **Nodemailer** with **Pug templates**.

Example flow:

```text
Password Reset Request
        │
        ▼
Generate Reset Token
        │
        ▼
Create Email
        │
        ▼
Pug Template
        │
        ▼
Nodemailer
        │
        ▼
User Email
```

---

# 🗄️ Database

MongoDB is used as the primary database with Mongoose providing:

* Schema definitions
* Data modeling
* Query abstraction
* Validation
* Relationships between resources

Main domain areas include:

```text
User
 │
 ├── Posts
 ├── Events
 └── Reviews

Post
 │
 ├── Category
 └── Reviews

Event
 │
 └── Reviews
```

---

# 🔒 Security

The API includes several security-related mechanisms:

* JWT authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected routes
* Cookie-based authentication
* Environment-based secrets
* Externalized file storage

For production deployments, additionally consider:

* Helmet
* Rate limiting
* Request validation
* Strict CORS configuration
* Secure cookie configuration
* Input sanitization
* Centralized structured logging
* Dependency vulnerability scanning
* Secret management
* API request size limits

---

# 🧪 Testing

The included Postman collection can be used for manual API testing.

Recommended automated test coverage:

```text
Authentication
├── Registration
├── Login
├── Logout
├── Invalid credentials
└── Password reset

Authorization
├── Unauthorized requests
├── Role restrictions
└── Protected resources

Posts
├── Create
├── Read
├── Update
└── Delete

Events
├── Create
├── Read
└── Registration

Reviews
├── Create
├── Read
└── Authorization
```

---

# 🚀 Production Checklist

Before deploying to production:

* [ ] Configure production MongoDB
* [ ] Configure secure JWT secrets
* [ ] Configure HTTPS
* [ ] Configure secure cookies
* [ ] Restrict CORS origins
* [ ] Configure production email provider
* [ ] Configure cloud storage
* [ ] Add request rate limiting
* [ ] Add security headers
* [ ] Add centralized logging
* [ ] Add health checks
* [ ] Add automated tests
* [ ] Add CI/CD
* [ ] Configure monitoring
* [ ] Configure database backups
* [ ] Scan dependencies for vulnerabilities

---

# 📌 Project Status

**Status:** Active backend project

TechHub currently provides the core backend functionality for authentication, blogging, events, categories, reviews, file uploads, and email notifications.

---

# 📄 License

This project is licensed under the **ISC License**.

---

# 👨‍💻 Author

**Khaled Helmy**

GitHub:
https://github.com/khaledhelmyg

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐.

**Repository:**
https://github.com/khaledhelmyg/tech-hob-backend
