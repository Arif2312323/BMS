import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: {
    field?: string;
    message: string;
  }[] = [];

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // 2. Generic Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    errors = [{ message: err.message }];
  }

  // 3. Unknown Error
  else {
    statusCode = 500;
    message = "Something went wrong";
    errors = [{ message: "Unknown error occurred" }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
export default globalErrorHandler;