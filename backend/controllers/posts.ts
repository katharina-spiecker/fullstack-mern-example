import { Request, Response, NextFunction, RequestHandler } from "express";
import Post from "../models/Post";
import { CustomRequest } from "../types";

export const getPosts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

export const getUserPosts: RequestHandler = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find({author: req.userId});
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export const createPost: RequestHandler = async (req: CustomRequest, res: Response, next: NextFunction) => {
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