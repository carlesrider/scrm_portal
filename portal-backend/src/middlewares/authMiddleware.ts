import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verifyToken } from "../services/authService.js";
import { PortalUser } from "../types/portal.js";

declare global {
  namespace Express {
    interface Request {
      user?: PortalUser;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authorization token missing"));
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};
