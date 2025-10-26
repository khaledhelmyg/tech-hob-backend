# TechHub-backend

TechHub-backend is a Node.js/Express REST API for a blogging and events platform. It supports user authentication, blog posts, categories, events, reviews, and file uploads, with Google Cloud and Cloudinary integration.

## Features

- User registration, login, logout, password reset (with JWT and cookies)
- Blog post CRUD with image upload (Google Cloud Storage)
- Event management and registration
- Category management
- Review system for posts/events
- Role-based authentication and authorization
- Pagination, filtering, and search for posts/events/categories
- Email notifications (password reset, etc.)

## Tech Stack

- Node.js, Express.js
- MongoDB (Mongoose)
- JWT, bcrypt
- Google Cloud Storage, Cloudinary, Multer
- Nodemailer, Pug (for emails)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance
- Google Cloud and/or Cloudinary credentials (for file uploads)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Na3ml/TechHub-backend.git
   cd TechHub-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` or `config.env` file based on `config.env` sample and set your environment variables (MongoDB URI, JWT secret, email credentials, etc.)
4. Start the development server:
   ```sh
   npm run start:dev
   ```

## API Endpoints

### Auth

- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/logout` — Logout
- `POST /api/v1/auth/forgot-password` — Request password reset
- `PATCH /api/v1/users/reset-password/:token` — Reset password

### Users

- `GET /api/v1/users/getuser/:id` — Get user profile
- `PATCH /api/v1/users/updateProfile/:id` — Update profile
- `PUT /api/v1/users/updatePassword/:id` — Update password

### Posts

- `GET /api/v1/posts/` — List all posts
- `POST /api/v1/posts/` — Create post (auth required)
- `GET /api/v1/posts/:id` — Get post by ID
- `PUT /api/v1/posts/update/:id` — Update post (auth required)
- `DELETE /api/v1/posts/delete/:id` — Delete post (auth required)

### Events

- `GET /api/v1/event/` — List all events
- `POST /api/v1/event/` — Create event (auth required)
- `GET /api/v1/event/:id` — Get event by ID
- `PATCH /api/v1/event/:id` — Register to event (auth required)

### Categories

- `POST /api/v1/category/create` — Create category (auth required)

### Reviews

- Review endpoints available for posts/events (see code for details)

## File Uploads

- Images are uploaded to Google Cloud Storage or Cloudinary (see `config/` and `services/`)

## License

ISC
