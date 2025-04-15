// import jwt from "jsonwebtoken";

// const isAuthenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     console.log(authHeader);
//

//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "You are not authorized",
//       });
//     }
//     const decode = jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }
//     req.id = decode.userID;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Invalid token",
//     });
//   }
// };

// export default isAuthenticate;

import jwt from "jsonwebtoken";
import client from "../database/redisdb.js";
const isAuthenticate = async (req, res, next) => {
  try {
    // Fix: Use "authorization" instead of "authorisation"
    const authHeader = req.headers["authorization"];
    console.log("Auth Header:", authHeader);

    // Fix: Check if authHeader exists and follows "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(" ")[1];

    const isBlocked = await client.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("Token has been revoked or is invalid");
    }

    // Verify token
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    // Fix: Assign correct userID to req
    req.userInfo = decode;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticate;
