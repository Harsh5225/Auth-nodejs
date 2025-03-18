# Image Upload & Authentication Backend

This is a Node.js backend project that provides secure image upload functionality with authentication and role-based access control. The backend is built using Express.js, MongoDB, and Cloudinary for cloud storage, ensuring smooth and efficient handling of images.

## Features

- **User Authentication**: Register, login, and logout users securely.
- **Role-Based Access Control**: Restrict certain actions based on user roles (Admin/User).
- **Image Upload**: Upload images to Cloudinary via multer middleware.
- **Fetch Uploaded Images**: Implement pagination and sorting while fetching images.
- **Delete Images**: Admin users can delete uploaded images.
- **Password Management**: Change password functionality for authenticated users.
- **Deployment**: Successfully deployed on both **Vercel** and **Render**, showcasing deployment expertise.
- **Error Handling**: Logs authentication failures, file upload errors, and database connection issues.

## Tech Stack

- **Node.js** (Backend framework)
- **Express.js** (Web framework for routing and middleware management)
- **MongoDB & Mongoose** (Database & ORM for storing user and image data)
- **Cloudinary** (Image storage and management)
- **JWT (JSON Web Token)** (Authentication and authorization)
- **Multer** (File upload middleware)
- **bcrypt.js** (Password hashing for security)
- **Vercel & Render** (Cloud deployment platforms)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Run the Project

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint        | Description |
|--------|----------------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user and get JWT token |
| GET    | `/api/auth/logout`   | Logout user |
| POST   | `/api/auth/change`   | Change password (Authenticated users) |

### Image Management

| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| GET    | `/api/image/fetch` | Fetch all uploaded images with pagination & sorting (Authenticated users) |
| POST   | `/api/image/upload` | Upload an image (Only Admin users) |
| DELETE | `/api/image/:id`    | Delete an image (Only Admin users) |

## Middleware

- **`isAuthenticate`**: Protects routes by ensuring only authenticated users can access them.
- **`isAdminUser`**: Ensures only admin users can upload and delete images.
- **`uploadMiddleware`**: Handles image uploads using `multer`.

## Deployment

The application is deployed on both **Vercel** and **Render**, demonstrating proficiency in cloud deployment.

- **Vercel Deployment:** [https://authenticationnodejs.vercel.app/](https://authenticationnodejs.vercel.app/)
- **Render Deployment:** [https://auth-nodejs-5sul.onrender.com](https://auth-nodejs-5sul.onrender.com)

## Common Deployment Issues

### Problem: Mongoose Timeout after Deployment

**Error:**
```
Error in user registration: MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```
**Cause:**
This happens because the MongoDB server is not allowing access from all networks. When deploying to cloud platforms like Vercel or Render, ensure that your MongoDB database allows external connections from the deployment environment.

**Solution:**
- Update the **IP Whitelist** in MongoDB Atlas to allow access from all IPs (`0.0.0.0/0`).
- Check if your **MONGO_URI** is correctly configured in the environment variables.

## Folder Structure
```
├── controllers  # Business logic for authentication and image management
├── models       # Mongoose schema models (User, Image)
├── middlewares  # Authentication and file upload middleware
├── config       # Cloudinary configuration
├── routes       # API route definitions
├── helpers      # Helper functions (Cloudinary upload helper)
├── .env         # Environment variables (not committed)
├── server.js    # Entry point of the application
├── vercel.json  # Configuration for Vercel deployment
``` 

## Contributions
Contributions are welcome! If you find any bugs or have feature requests, feel free to open an issue or submit a pull request.

## License
This project is open-source and available under the [MIT License](LICENSE).

