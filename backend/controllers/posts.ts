import { Request, Response, NextFunction } from "express";
import Post from "../models/Post.js";
import { CustomRequest } from "../types.ts";

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

export const getUserPosts = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find({author: req.userId});
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export const createPost = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
  }