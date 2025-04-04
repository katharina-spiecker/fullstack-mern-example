import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.ts";
import postsRouter from "./routes/posts.ts";
import helmet from "helmet";

await mongoose.connect(process.env.DB_URI!);

const app: Application = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173']
}));
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api", postsRouter);

// global error handling middleware
app.use((err, req: Request, res: Response, next: NextFunction) => {
    // failed mongoDB Schema validation (err.code is 121)
if (err.name === "MongoServerError" && err.code === 121) {
    res.status(400).send("Invalid request data");
} else {
    res.status(err.status || 500).send(err.message || "Internal Server Error");
}
});

// fallback, if no matching route found
app.use((req: Request, res: Response) => {
    res.status(404).send("Not found");
})

app.listen("3000", () => console.log("server started on port 3000"));