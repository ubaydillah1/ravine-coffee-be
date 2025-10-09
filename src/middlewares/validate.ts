import { ZodObject, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation Error",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      res.status(500).json({ message: (err as Error).message });
    }
  };
