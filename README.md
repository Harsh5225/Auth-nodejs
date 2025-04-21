
---

# 🔐 Secure Auth Backend with Redis, Rate Limiting & Image Upload (Node.js + Cloudinary)

A powerful and production-ready backend that blends **JWT authentication**, **Redis-based token blacklisting**, **sliding window rate limiting**, and **secure image uploads** to Cloudinary. It's designed for **performance, scalability, and security**—perfect for modern web apps.

---

## 🚨 New Feature: Sliding Window Rate Limiting (Per IP)

To protect endpoints like **login** from brute-force or abuse, we've integrated a **sliding window rate limiter** using Redis `ZSETs`.

### ⚡ Highlights

- 🧠 **Smart Rate Limiting**: Sliding window accuracy vs. fixed windows.
- 📍 **Per-IP Tracking**: Every user/IP tracked separately.
- 🔄 **Auto-Expire**: Old entries expire automatically after 60s.
- ⚡ **High Performance**: Leveraging Redis’ blazing speed.

### 🧩 How It Works

1. Client IP is fetched on every request.
2. Old timestamps are removed (older than 60 seconds).
3. Count how many hits are within the last minute.
4. If count exceeds the limit (e.g., 5), return `429 Too Many Requests`.
5. Otherwise, log the new request with a timestamp + UUID.

📦 **Code Snippet**

```js
import client from "../database/redisdb.js";
import { randomUUID } from "crypto";

const slidingWindowRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rateLimiter:${ip}`;
    const now = Date.now();
    const windowStart = now - 60 * 1000;

    await client.zRemRangeByScore(key, 0, windowStart);
    const count = await client.zCount(key, windowStart, now);

    if (count >= 5) {
      return res.status(429).send("Too many login attempts. Try again later.");
    }

    await client.zAdd(key, [{ score: now, value: `${now}-${randomUUID()}` }]);
    await client.expire(key, 60);

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
```

---

## 🔐 Redis Token Blacklisting for Secure Logout

Even though JWTs are stateless, you still need a way to **invalidate tokens** after logout. That’s where **Redis blacklisting** comes in.

### ✅ Benefits

- 🚫 Prevent reuse of logged-out tokens.
- 🧼 Auto-clears expired blacklisted tokens.
- 🔒 Adds session-like control to JWT.

### 🔁 Flow Diagram


![Project Architecture](https://github.com/Harsh5225/Auth-nodejs/blob/main/diagram.png)
![Redis Blacklist Flow](https://github.com/Harsh5225/Auth-nodejs/blob/main/uploads/redisBlacklistflow.png)

---

## 🖼️ Image Upload Backend with Authentication

Built with **Express**, **MongoDB**, **Redis**, and **Cloudinary**, this API supports:

- 🔐 Authentication (register/login/logout)
- 👥 Role-based access (admin/user)
- 🖼 Secure image uploads (admins only)
- 📦 Image fetching with pagination
- 🗑 Image deletion (admin only)

---

## 🧰 Features at a Glance

| Feature                  | Description                                |
|--------------------------|--------------------------------------------|
| 🔐 JWT Auth              | Secure login and token-based sessions      |
| 🔁 Redis Blacklisting    | Invalidate tokens after logout             |
| ⚡ Sliding Window Limit  | Prevent brute-force login attempts         |
| 🖼 Cloudinary Uploads    | Cloud storage for images                   |
| 🔐 Role-based Access     | Admin-only and user-specific permissions   |
| 🔍 Pagination/Sorting    | Organized image retrieval                  |
| 🧹 Auto Cleanup          | Redis TTL handles expired data             |
| ☁️ Deployed on Vercel    | Fast, serverless performance               |

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB Atlas** + **Mongoose**
- **JWT** + **bcrypt**
- **Redis** – for blacklisting & rate limiting
- **Cloudinary** – image uploads
- **Multer** – file handling
- **Vercel** – primary deployment

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Setup `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_jwt_secret
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3. Start Server

```bash
npm start
```

---

## 🔗 API Endpoints

### 🧑 Authentication

| Method | Route                 | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/auth/register`  | Register a new user            |
| POST   | `/api/auth/login`     | Login user & receive JWT       |
| GET    | `/api/auth/logout`    | Logout user                    |
| POST   | `/api/auth/change`    | Change user password           |

### 🖼 Image Routes

| Method | Route                 | Access | Description                  |
|--------|-----------------------|--------|------------------------------|
| GET    | `/api/image/fetch`    | All    | Fetch all images (paginated)|
| POST   | `/api/image/upload`   | Admin  | Upload image to Cloudinary  |
| DELETE | `/api/image/:id`      | Admin  | Delete image by ID          |

---

## 🧩 Middleware Overview

| Middleware              | Role                                         |
|-------------------------|----------------------------------------------|
| `isAuthenticate`        | JWT + Redis token check                      |
| `isAdminUser`           | Role check for admin users                   |
| `uploadMiddleware`      | Parses and handles image file uploads        |
| `slidingWindowRateLimiter` | Login rate limiting per IP using Redis |

---

## 🗂️ Folder Structure

```
├── controllers      # Business logic
├── middlewares      # Auth, role, upload, rate limiter
├── models           # MongoDB models (User, Image)
├── routes           # Route definitions
├── utils            # Redis client, helpers
├── config           # Cloudinary configuration
├── server.js        # Main app entry
├── .env             # Config (gitignored)
└── vercel.json      # Deployment config
```

---

## ☁️ Deployed On

- 🔗 **Frontend:** [Vercel](https://authenticationnodejs.vercel.app/)
- 🔗 **Backend API:** [Render API](https://auth-nodejs-5sul.onrender.com)

---

## 🛠 Add `app.set('trust proxy', 1)` for Vercel

To correctly capture client IP behind Vercel’s proxy, add this to `server.js` **before** you use any middleware that depends on IP (like rate limiter):

```js
const app = express();
app.set('trust proxy', 1); // ✅ Important for Vercel to get correct IP
```

---

## 🧩 Troubleshooting

### ❌ Mongoose Timeout?

```bash
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

✅ Fix:
- Add `0.0.0.0/0` to your MongoDB IP whitelist.
- Double-check your `.env` Mongo URI.

---

## 🤝 Contributions Welcome

Pull requests, issues, and suggestions are welcome! Let’s build better together 💪

---

## 🪪 License

MIT © [Harsh]
