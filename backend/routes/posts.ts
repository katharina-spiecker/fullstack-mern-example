import express, { Request, Response, Router, NextFunction } from "express";
import Post from "../models/Post.js";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { CustomRequest } from "../types.ts";

const router: Router = express.Router();

router.get("/posts", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
})

router.get("/user/posts", authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find({author: req.userId});
    res.json(posts);
  } catch (error) {
    next(error);
  }
})

router.post("/posts", authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
  const title = req.body.title;
  const description = req.body.description;

  try {
     const newPost = await Post.create({
        title: title,
        description: description,
        author: req.userId
     })
     res.status(201).json(newPost);
  } catch (error) {
     next(error);
  }
})

export default router;