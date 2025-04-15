

---

```markdown
# 🔐 Secure Authentication Backend with Redis Token Blacklisting & Image Upload System

This project combines **JWT authentication with Redis-based token blacklisting** and **secure image upload functionality** using Cloudinary. It ensures robust, scalable, and secure handling of user sessions, image storage, and role-based access control.

## 🚀 New Feature: Redis Token Blacklisting

To ensure secure logout functionality even with stateless JWTs, Redis is integrated to blacklist tokens post-logout.

### ✅ Key Benefits
- **Stateless + Secure**: Adds a session-like control to JWT without losing stateless benefits.
- **Prevents Reuse**: Logged out or invalidated tokens can't be reused maliciously.
- **Redis TTL**: Automatically removes blacklisted tokens when they expire.

### 🔁 Workflow

1. **Login**:
   - User receives a JWT after authentication.
2. **Authenticated Requests**:
   - Middleware checks Redis to ensure token isn't blacklisted.
3. **Logout**:
   - JWT is stored in Redis with TTL equal to its remaining validity.
   - Future requests with this token are denied.

### 📈 Flow Diagram
![Flow Diagram](./assets/token-blacklist-flow.png)
> *(Make sure this image exists in your `assets/` folder or update the path)*

---

# 🖼️ Image Upload & Authentication Backend

This is a Node.js backend project that provides secure image upload functionality with authentication and role-based access control. Built using **Express.js**, **MongoDB**, and **Cloudinary**, it enables efficient image handling with scalable authentication.

## 🔧 Features

- 🔐 **User Authentication**: Register, login, logout, change password.
- 🧑‍💼 **Role-Based Access**: Different permissions for Admins and Users.
- ☁️ **Cloudinary Integration**: Store images in the cloud.
- 📦 **Redis Blacklist**: Secure logout functionality.
- 🔄 **Pagination + Sorting**: Fetch uploaded images in an organized manner.
- 🗑️ **Image Deletion**: Admin-only image removal.
- ⚙️ **Error Logging**: Logs failures in auth, uploads, and DB connections.
- 🚀 **Deployment Ready**: Hosted on **Vercel** & **Render**.

---

## 🛠 Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – Routing & Middleware
- **MongoDB + Mongoose** – NoSQL database and ORM
- **Cloudinary** – Cloud image storage
- **JWT** – Token-based authentication
- **Redis** – In-memory token blacklist store
- **Multer** – File handling middleware
- **bcrypt.js** – Password hashing
- **Vercel + Render** – Deployment platforms

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Redis](https://redis.io/)

### Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Configure environment variables in .env
```

#### `.env` Example:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# 4. Start the server
npm start
```

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint               | Description                       |
|--------|------------------------|-----------------------------------|
| POST   | `/api/auth/register`   | Register a new user               |
| POST   | `/api/auth/login`      | Login user and receive JWT        |
| GET    | `/api/auth/logout`     | Logout and blacklist JWT          |
| POST   | `/api/auth/change`     | Change password (Authenticated)   |

### 🖼 Image Management

| Method | Endpoint               | Description                       |
|--------|------------------------|-----------------------------------|
| GET    | `/api/image/fetch`     | Fetch uploaded images (paginated)|
| POST   | `/api/image/upload`    | Upload image (Admin only)         |
| DELETE | `/api/image/:id`       | Delete image (Admin only)         |

---

## 🔐 Middleware Breakdown

- `isAuthenticate`: Verifies JWT and checks Redis blacklist.
- `isAdminUser`: Allows only admins to perform certain actions.
- `uploadMiddleware`: Uses `multer` to handle image uploads.

---

## 🗃 Folder Structure
```
├── controllers      # Business logic
├── middlewares      # Authentication, role checks, upload handler
├── models           # Mongoose models (User, Image)
├── routes           # Auth & image APIs
├── utils            # Redis client and helper functions
├── config           # Cloudinary configuration
├── helpers          # Upload helpers, response formatters
├── .env             # Environment configs (not committed)
├── server.js        # Main entry
├── vercel.json      # Vercel deployment config
```

---

## ☁️ Deployment

- ✅ **Vercel**: [https://authenticationnodejs.vercel.app/](https://authenticationnodejs.vercel.app/)
- ✅ **Render**: [https://auth-nodejs-5sul.onrender.com](https://auth-nodejs-5sul.onrender.com)

---

## ⚠️ Common Deployment Issues

### ❌ Mongoose Timeout
**Error:**
```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

**Fix:**
- Update **MongoDB Atlas IP whitelist** to `0.0.0.0/0`
- Ensure correct URI is provided in `.env`

---

## 🤝 Contributions

We welcome contributions and suggestions. Open an issue or submit a PR for improvements.

---

## 🪪 License

MIT License – feel free to use, share, and contribute.
```

---
