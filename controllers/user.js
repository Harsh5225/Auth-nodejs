import { user } from "../models/user.js";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    // Check if the user already exists (by username or email)
    const checkExistingUser = await user.findOne({
      $or: [{ userName }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "You already have an existing account. Please sign in.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new user({
      userName,
      email,
      password: hashedPassword,
      role: role || "user", // Default role if not provided
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .stauts(403)
        .json({ message: "All fields are required", success: false });
    }
    const userExists = await user.findOne({ userName });
    if (!userExists) {
      // 403 a web server is unable to grant access to a requested resource
      return res
        .status(403)
        .json({ message: "user does not exists", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, userExists.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await jwt.sign(
      {
        userID: userExists._id,
        username: userExists.userName,
        role: userExists.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        success: true,
        message: "You have logged successfully",
        accesstoken: token,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Some error occured,plz try again..",
    });
  }
};

export const logout = async () => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured,plz try again..",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log(req.userInfo.userID);
    const user_ID = req.userInfo.userID;

    // old and new password
    const { oldPass, newPass } = req.body;

    // find the current user logged in
    const userobj = await user.findById(user_ID);
    if (!userobj) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check oldpassword

    const isPasswordMatch = await bcrypt.compare(oldPass, userobj.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPass, salt);

    userobj.password = newHashedPassword;

    await userobj.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occured,plz try again..",
    });
  }
};
