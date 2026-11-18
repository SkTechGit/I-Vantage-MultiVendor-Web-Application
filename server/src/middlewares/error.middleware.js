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

  // Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    const message =
      Object.values(err.errors || {})
        .map((e) => e.message)
        .join(", ") || err.message;
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message,
    });
  }

  // Common Business / Access Errors (Avoid generic 500)
  if (
    err.message &&
    (err.message.includes("not found") ||
      err.message.includes("access denied") ||
      err.message.includes("Access denied"))
  ) {
    return res.status(404).json({
      success: false,
      code: "NOT_FOUND_OR_DENIED",
      message: err.message,
    });
  }

  // Custom API Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code && { code: err.code }),
      ...(err.details || {}),
    });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value found.",
    });
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      code: "INVALID_IDENTIFIER",
      message: "The requested resource identifier is invalid.",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Security authorization token is malformed or invalid.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      code: "TOKEN_EXPIRED",
      message: "Your session token has expired. Please sign in again.",
    });
  }

  // Default Error
  const isProduction = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: isProduction
      ? "An unexpected security or server error occurred. Please try again later."
      : (err.message || "Internal Server Error"),
  });
};

export default errorHandler;