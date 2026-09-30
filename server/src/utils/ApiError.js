class ApiError extends Error {
  constructor(statusCode, message, code = null, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;