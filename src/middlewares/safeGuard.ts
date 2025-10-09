import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { config } from "../lib/config.js";
import type { UserRole } from "@prisma/client";

interface JwtPayload {
  id: string;
  role: string;
}

export const safeGuard = (allowedRoles?: UserRole | UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({ message: "Unauthorized: Token required" });
        return;
      }

      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      } catch {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (allowedRoles) {
        const roles = Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles];
        if (!roles.includes(user.role)) {
          res.status(403).json({ message: "Forbidden: Access denied" });
          return;
        }
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("safeGuard error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
};
