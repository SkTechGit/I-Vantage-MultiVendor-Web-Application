/**
 * Security Middleware Suite for i-VANTAGE Server
 * Enterprise Defense-in-Depth against NoSQL Injection, XSS, Parameter Pollution,
 * Prototype Pollution, and Clickjacking.
 */

/**
 * Deep in-place sanitization function to strip MongoDB query operators ($ and .)
 * and dangerous JavaScript prototype properties.
 * Mutates in place to support Express 5 where req.query is a getter.
 */
function cleanObjectInPlace(obj, depth = 0) {
  if (depth > 10 || !obj || typeof obj !== "object" || obj instanceof Date) return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object" && obj[i] !== null) {
        cleanObjectInPlace(obj[i], depth + 1);
      } else if (typeof obj[i] === "string") {
        obj[i] = obj[i].replace(/\0/g, "");
      }
    }
    return;
  }

  const keys = Object.keys(obj);
  for (const key of keys) {
    // Dangerous prototype or NoSQL injection keys
    if (
      key === "__proto__" ||
      key === "constructor" ||
      key === "prototype" ||
      key.startsWith("$") ||
      key.includes(".")
    ) {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanObjectInPlace(obj[key], depth + 1);
    } else if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(/\0/g, "");
    }
  }
}

/**
 * Middleware: NoSQL Injection & Prototype Pollution Sanitizer
 */
export const noSqlSanitizer = (req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") {
      cleanObjectInPlace(req.body);
    }
    if (req.query && typeof req.query === "object") {
      cleanObjectInPlace(req.query);
    }
    if (req.params && typeof req.params === "object") {
      cleanObjectInPlace(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Enterprise Security HTTP Headers
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent Clickjacking / Framing
  res.setHeader("X-Frame-Options", "DENY");

  // XSS Protection for legacy browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(self), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );

  // Strict Transport Security (HSTS) - 2 years + subdomains
  if (process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  // Remove Express identifier
  res.removeHeader("X-Powered-By");

  next();
};
