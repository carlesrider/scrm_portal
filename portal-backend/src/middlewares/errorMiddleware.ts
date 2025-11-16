import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = createHttpError.isHttpError(err)
    ? err
    : createHttpError(500, err instanceof Error ? err.message : "Unknown error");

  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(error.statusCode || 500).json({
    message: error.message,
    status: error.statusCode || 500
  });
};
