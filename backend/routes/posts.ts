import express, { Request, Response, Router, NextFunction } from "express";
import Post from "../models/Post.js";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { CustomRequest } from "../types.ts";
import * as controllers from "../controllers/posts.ts";

const router: Router = express.Router();

router.get("/posts", controllers.getPosts);

router.get("/user/posts", authMiddleware, controllers.getUserPosts)

router.post("/posts", authMiddleware, controllers.createPost)

export default router;