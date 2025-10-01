import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface CurrentUser {
  id: string;
  role: "ADMIN" | "USER";
}

// Extend Express Request to include currentUser
declare module "express-serve-static-core" {
  interface Request {
    currentUser?: CurrentUser;
  }
}

/* ------------------ JWT Verification ------------------ */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as CurrentUser;
    req.currentUser = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ------------------ Role-based Middleware ------------------ */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser?.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
