import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true, //removes whitespace from the beginning and end
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], //only allow user or admin
      default: "user",
    },
  },
  { timestamps: true }
); // Enables createdAt & updatedAt

export const user = mongoose.model("user", userSchema);
