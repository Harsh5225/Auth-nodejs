import express from "express";
import isAuthenticate from "../middlewares/auth-middleware.js";
import isAdminUser from "../middlewares/admin-middleware.js";
const router = express.Router();

router.get("/welcome", isAuthenticate,isAdminUser,(req, res) => {
  const { username, userID, role } = req.userInfo;
  console.log(role)
  if (role === "admin") {
    return res.status(200).json({
      user: {
        username,
        userID,
        role,
      },
      message: "wlcm to Admin page",
    });
  }else{
    return res.status(401).json({
    success:false,
    message:"You don't have an admin role.."
    })
  }
});


export default  router;