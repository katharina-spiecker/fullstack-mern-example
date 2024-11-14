import express from "express";
import Post from "../models/Post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.get("/user/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({author: req.user._id});
    res.json(posts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.post("/posts", authMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  try {
     const newPost = await Post.create({
        title: title,
        description: description,
        author: req.user._id
     })
     res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

export default router;