

---

# 🔐 Secure Image Upload API with JWT Authentication & Redis Blacklist

![Project Architecture](https://github.com/Harsh5225/Auth-nodejs/blob/main/diagram.png)
![Redis Blacklist Flow](https://github.com/Harsh5225/Auth-nodejs/blob/main/uploads/redisBlacklistflow.png)

A robust Node.js backend featuring secure authentication, role-based access control, image management with Cloudinary, and Redis-powered JWT token blacklisting.

## ✨ Key Features

### Authentication System
- ✅ JWT-based user registration/login
- ✅ Redis-powered token blacklisting for secure logout
- ✅ Role-based access control (Admin/User)
- ✅ Password change functionality
- ✅ Protected routes with middleware

### Image Management
- 🖼️ Cloudinary image upload (Admin-only)
- 📂 Fetch images with pagination & sorting
- 🗑️ Image deletion (Admin-only)
- 🔐 Secure file handling with Multer middleware

### Deployment
- 🚀 Dual deployment on Vercel & Render
- 🔧 Environment variable configuration
- ⏱️ MongoDB connection optimization

## 🛠️ Tech Stack

| Category       | Technologies Used                          |
|----------------|--------------------------------------------|
| Backend        | Node.js, Express.js                        |
| Database       | MongoDB (Mongoose ODM)                     |
| Authentication | JWT, Redis (for token blacklisting)        |
| File Storage   | Cloudinary, Multer                         |
| Security       | bcrypt.js (password hashing)               |
| Deployment     | Vercel, Render                             |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Harsh5225/Auth-nodejs.git
cd Auth-nodejs

# Install dependencies
npm install

# Set up environment variables (create .env file)
cp .env.example .env
```

### Environment Variables
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
REDIS_URL=your_redis_connection_url
JWT_EXPIRES_IN=1h
```

## 🚀 Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint               | Description                     | Access      |
|--------|------------------------|---------------------------------|-------------|
| POST   | `/api/auth/register`   | Register new user               | Public      |
| POST   | `/api/auth/login`      | Login user (get JWT token)      | Public      |
| GET    | `/api/auth/logout`     | Logout (blacklist token)        | Private     |
| POST   | `/api/auth/change`     | Change password                 | Private     |

### Image Management
| Method | Endpoint               | Description                     | Access      |
|--------|------------------------|---------------------------------|-------------|
| GET    | `/api/image/fetch`     | Fetch images (pagination)       | Private     |
| POST   | `/api/image/upload`    | Upload image to Cloudinary      | Admin-only  |
| DELETE | `/api/image/:id`       | Delete image                   | Admin-only  |

## 🔒 Redis Token Blacklisting Flow

1. **Login**: User receives JWT token
2. **Protected Access**: Middleware checks Redis for blacklisted tokens
3. **Logout**: Token added to Redis with TTL matching JWT expiry
4. **Subsequent Requests**: Blacklisted tokens are rejected

```javascript
// Example middleware
const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (await redisClient.get(`bl_${token}`)) {
    return res.status(401).json({ message: "Token revoked" });
  }
  next();
};
```

## 🏗️ Project Structure

```
Auth-nodejs/
├── config/               # Configuration files
│   ├── cloudinary.js     # Cloudinary setup
│   └── redis.js         # Redis client configuration
├── controllers/          # Business logic
│   ├── authController.js
│   └── imageController.js
├── middlewares/          # Custom middleware
│   ├── auth.js          # Authentication
│   ├── errorHandler.js  # Error handling
│   └── upload.js       # File upload
├── models/              # Mongoose models
│   ├── User.js
│   └── Image.js
├── routes/              # API routes
│   ├── auth.js
│   └── image.js
├── utils/               # Helper functions
│   └── apiFeatures.js  # Pagination/sorting
├── .env.example        # Environment template
├── server.js          # Entry point
└── vercel.json        # Vercel config
```

## 🌐 Live Deployments

- **Vercel**: [https://authenticationnodejs.vercel.app/](https://authenticationnodejs.vercel.app/)
- **Render**: [https://auth-nodejs-5sul.onrender.com](https://auth-nodejs-5sul.onrender.com)

## 🚀 Deployment Notes

### Common Issues & Solutions

**Mongoose Timeout Error**
```bash
MongooseError: Operation `users.findOne()` buffering timed out
```
✅ **Fix**: 
1. Whitelist all IPs (`0.0.0.0/0`) in MongoDB Atlas
2. Verify `MONGO_URI` in environment variables

**Redis Connection Issues**
```bash
Redis connection error: ECONNREFUSED
```
✅ **Fix**:
1. Ensure Redis server is running
2. Check `REDIS_URL` format: `redis://<host>:<port>`

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a new branch
3. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

