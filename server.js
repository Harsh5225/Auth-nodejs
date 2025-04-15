import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.js";
import Homeroutes from "./routes/Homeroutes.js";
import Adminroutes from "./routes/Adminroutes.js";
import uploadImageRouter from "./routes/imageroutes.js";
import client from "./database/redisdb.js";
const app = express();

dotenv.config();
// connectDB();
// middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
//
app.use("/app/auth", userRoutes);
app.use("/app/home", Homeroutes);
app.use("/app/admin", Adminroutes);
app.use("/app/image", uploadImageRouter);

// this is good standard for database connection and server listening
const main = async () => {
  try {
    // await client.connect();
    // await connectDB();
    // then connectDB() wouldn't even start until client.connect() finishes.

    // means both client.connect() and connectDB() will start executing at the same time, in parallel.
    await Promise.all([client.connect(), connectDB()]);

    console.log("mongoDb is connected");
    console.log("Redis is connected");

    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Connection issue with db");
  }
};

main();
