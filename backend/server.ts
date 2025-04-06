import express, { Request, Response, NextFunction, Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import helmet from "helmet";
import connectDB from "./db";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app: Express = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL_CORS!,
  credentials: true
}));
app.use(cookieParser());
// app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api", postsRouter);

// global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ "error": "Validation error", details: err.message });
    } else {
        res.status(err.status || 500).json({
            message: err.message,
            error: err,
        });
    }
});
  

// // fallback, if no matching route found
app.use((req: Request, res: Response) => {
    res.status(404).send("Not found");
})

app.listen("3000", () => console.log("server started on port 3000"));