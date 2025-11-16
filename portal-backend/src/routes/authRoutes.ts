import { Router } from "express";
import createHttpError from "http-errors";
import { authenticatePortalUser } from "../services/authService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };
    const result = await authenticatePortalUser(username || "", password || "");
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.json({ success: true });
});

authRouter.get("/me", authMiddleware, (req, res, next) => {
  if (!req.user) {
    return next(createHttpError(401, "Unauthorized"));
  }

  return res.json({ contact: req.user });
});
