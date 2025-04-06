import jwt from "jsonwebtoken";
import { Response, NextFunction, RequestHandler, Request } from "express";
import { CustomRequest } from "../types.js";
import dotenv from 'dotenv';
dotenv.config();

type jwtPayload = {
    userId: string
}

export const authMiddleware: RequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send();
      return;
    } 
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send();
        return;
    }
    
    try {
        const decoded: jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwtPayload;
        req.userId = decoded.userId;
        next();
    } catch(err) {
       res.status(401).send();
       return;
    }
  }