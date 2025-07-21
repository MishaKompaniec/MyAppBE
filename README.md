# Flower Shop Backend

REST API backend for an online flower shop built with Node.js, Express, and MongoDB.

---

## Overview

This backend application provides functionality to manage products, users, and orders for an online flower store. It uses modern technologies and best practices, including:

- Authentication and authorization with JWT
- User roles (regular user, admin)
- Image uploads for products and user avatars to AWS S3
- Validation and error handling
- Protected routes with middleware

---

## Technologies & Tools

- **Node.js** (ES Modules)
- **Express 5** — web framework
- **MongoDB** + **Mongoose** — database and ORM
- **JSON Web Token (JWT)** — authentication and API security
- **AWS S3** — image storage (products and avatars)
- **Multer** + **multer-s3** — file upload handling
- **dotenv** — environment variable management
- **CORS** — Cross-Origin Resource Sharing setup for frontend apps
- **nodemon** — development utility for automatic server restart

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository_url>
cd <project_folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root with the following variables:

```env
PORT=4200
NODE_ENV=development

MONGODB_URI=<production_mongodb_connection_string>
MONGODB_URI_LOCAL=mongodb://localhost:27017/dev_db

JWT_SECRET=<your_jwt_secret_key>

AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_REGION=<your_aws_region>
```

> **Note:** For local development, use `MONGODB_URI_LOCAL` to point to your local MongoDB instance.

### 4. Run the development server

```bash
npm run dev
```

The server will start and listen at `http://localhost:4200`.

---

## Main API Endpoints

### Products (`/api/products`)

| Method | Endpoint     | Description          |
| ------ | ------------ | -------------------- |
| GET    | `/`          | Get all products     |
| POST   | `/`          | Create a new product |
| PUT    | `/:id`       | Update product by ID |
| DELETE | `/:id`       | Delete product by ID |
| POST   | `/:id/image` | Upload product image |

---

### Users (`/api/user`)

| Method | Endpoint       | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| POST   | `/register`    | Register a new user                         |
| POST   | `/login`       | Login and receive JWT token                 |
| GET    | `/me`          | Get current user profile (auth required)    |
| PUT    | `/me`          | Update current user profile (auth required) |
| POST   | `/me/avatar`   | Upload user avatar (auth required)          |
| GET    | `/me/avatar`   | Get user avatar URL (auth required)         |
| PUT    | `/me/password` | Change user password (auth required)        |

---

### Orders (`/api/orders`)

| Method | Endpoint        | Description                        |
| ------ | --------------- | ---------------------------------- |
| POST   | `/`             | Create a new order (auth required) |
| GET    | `/`             | Get all orders (admin only)        |
| GET    | `/mine`         | Get orders of the current user     |
| PUT    | `/:id/complete` | Mark order as completed            |
| DELETE | `/:id`          | Delete order by ID                 |

---

## Authentication & Authorization

- JWT tokens must be sent in the `Authorization` header as `Bearer <token>`.
- Middleware verifies tokens and attaches user info to `req.user`.
- Certain routes are protected and accessible only by admins.

---

## Image Uploads

- Uses AWS S3 with `multer-s3` to store images.
- File size limit: 2MB.
- Only image files are accepted.
- Separate S3 buckets and key prefixes for product images and user avatars.
