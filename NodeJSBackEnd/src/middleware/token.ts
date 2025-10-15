// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userid: string };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Authorization: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    ) as { userid: string };
    req.user = { userid: decoded.userid };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};
