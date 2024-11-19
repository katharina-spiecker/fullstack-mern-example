import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";

await mongoose.connect(process.env.DB_URI);

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://fullstack-mern-example-frontend.onrender.com']
}));

app.use("/api/auth", authRouter);
app.use("/api", postsRouter);

app.listen("3000", () => console.log("server started on port 3000"));