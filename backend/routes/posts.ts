import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as controllers from "../controllers/posts";

const router: Router = express.Router();

router.get("/posts", controllers.getPosts);

router.get("/user/posts", authMiddleware, controllers.getUserPosts)

router.post("/posts", authMiddleware, controllers.createPost)

export default router;