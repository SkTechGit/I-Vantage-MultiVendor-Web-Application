import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0].message,
    });
  }

  // Custom API Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value found.",
    });
  }

  // Default Error
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV !== "production" && err.message
        ? err.message
        : "Internal Server Error",
  });
};

export default errorHandler;