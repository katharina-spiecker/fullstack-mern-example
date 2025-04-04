import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types.js";

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch(err) {
    return res.status(401).send();
  }
}