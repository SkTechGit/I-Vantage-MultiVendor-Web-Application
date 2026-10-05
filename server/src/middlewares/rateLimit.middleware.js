/**
 * Enterprise Rate Limiting & Brute-Force Defense Middleware
 * Protects against credential stuffing, brute force attacks, and volumetric denial of service.
 */

class MemoryStore {
  constructor(windowMs = 15 * 60 * 1000) {
    this.windowMs = windowMs;
    this.hits = new Map();

    // Auto-cleanup every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.hits.entries()) {
        if (now - record.startTime > this.windowMs) {
          this.hits.delete(key);
        }
      }
    }, 5 * 60 * 1000).unref();
  }

  increment(key) {
    const now = Date.now();
    let record = this.hits.get(key);

    if (!record || now - record.startTime > this.windowMs) {
      record = { count: 1, startTime: now, lockUntil: 0 };
      this.hits.set(key, record);
      return record;
    }

    record.count += 1;
    return record;
  }

  get(key) {
    const now = Date.now();
    const record = this.hits.get(key);
    if (!record) return null;
    if (now - record.startTime > this.windowMs && (!record.lockUntil || now > record.lockUntil)) {
      this.hits.delete(key);
      return null;
    }
    return record;
  }

  lock(key, durationMs) {
    const now = Date.now();
    let record = this.hits.get(key) || { count: 0, startTime: now };
    record.lockUntil = now + durationMs;
    this.hits.set(key, record);
  }

  reset(key) {
    this.hits.delete(key);
  }
}

// 1. General API Rate Limiter Store (300 requests / minute)
const apiStore = new MemoryStore(60 * 1000);

// 2. Auth Endpoint Rate Limiter Store (25 requests / 15 minutes per IP)
const authStore = new MemoryStore(15 * 60 * 1000);

// 3. Failed Login / Account Lockout Store (5 failed attempts -> 15 min lock)
const failedLoginStore = new MemoryStore(15 * 60 * 1000);

/**
 * Helper to extract client IP safely
 */
export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || "127.0.0.1";
};

/**
 * General API Rate Limiter (300 req / minute per IP)
 */
export const apiRateLimiter = (maxRequests = 300, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    // Exempt health check and preflight requests
    if (req.method === "OPTIONS" || req.path === "/health" || req.path === "/") {
      return next();
    }

    const ip = getClientIp(req);
    const record = apiStore.increment(ip);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));

    if (record.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      return res.status(429).json({
        success: false,
        code: "RATE_LIMIT_EXCEEDED",
        message: "High request volume detected from this network. Please slow down and try again shortly.",
      });
    }

    next();
  };
};

/**
 * Authentication Route Rate Limiter (Max 25 attempts per 15 minutes per IP)
 */
export const authRateLimiter = (maxAttempts = 25, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") return next();

    const ip = getClientIp(req);
    const record = authStore.increment(ip);

    if (record.count > maxAttempts) {
      const waitMinutes = Math.ceil(windowMs / 60000);
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      return res.status(429).json({
        success: false,
        code: "AUTH_RATE_LIMIT",
        message: `Too many sign-in requests from your network. For security reasons, please wait ${waitMinutes} minutes before trying again.`,
      });
    }

    next();
  };
};

/**
 * Check if an email or IP is currently locked due to repeated bad credentials
 */
export const checkAccountLockout = (email, ip) => {
  const now = Date.now();
  const normalizedEmail = (email || "").toLowerCase().trim();

  // Check email lock
  if (normalizedEmail) {
    const emailRecord = failedLoginStore.get(`email:${normalizedEmail}`);
    if (emailRecord && emailRecord.lockUntil && now < emailRecord.lockUntil) {
      const remainingMinutes = Math.max(1, Math.ceil((emailRecord.lockUntil - now) / 60000));
      return {
        locked: true,
        remainingMinutes,
        message: `This account is temporarily locked for security due to multiple failed sign-in attempts. Please try again in ${remainingMinutes} minute(s) or reset your credentials.`,
      };
    }
  }

  // Check IP lock
  if (ip) {
    const ipRecord = failedLoginStore.get(`ip:${ip}`);
    if (ipRecord && ipRecord.lockUntil && now < ipRecord.lockUntil) {
      const remainingMinutes = Math.max(1, Math.ceil((ipRecord.lockUntil - now) / 60000));
      return {
        locked: true,
        remainingMinutes,
        message: `Too many failed attempts from your location. Sign-in is temporarily suspended for ${remainingMinutes} minute(s).`,
      };
    }
  }

  return { locked: false };
};

/**
 * Record a failed authentication attempt (locks out after 5 failures for 15 minutes)
 */
export const recordFailedLogin = (email, ip) => {
  const LOCKOUT_THRESHOLD = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  const normalizedEmail = (email || "").toLowerCase().trim();

  if (normalizedEmail) {
    const key = `email:${normalizedEmail}`;
    const record = failedLoginStore.increment(key);
    if (record.count >= LOCKOUT_THRESHOLD) {
      failedLoginStore.lock(key, LOCKOUT_DURATION);
    }
  }

  if (ip) {
    const key = `ip:${ip}`;
    const record = failedLoginStore.increment(key);
    if (record.count >= LOCKOUT_THRESHOLD * 2) {
      failedLoginStore.lock(key, LOCKOUT_DURATION);
    }
  }
};

/**
 * Reset failed attempts upon successful login
 */
export const resetFailedLogin = (email, ip) => {
  const normalizedEmail = (email || "").toLowerCase().trim();
  if (normalizedEmail) {
    failedLoginStore.reset(`email:${normalizedEmail}`);
  }
  if (ip) {
    failedLoginStore.reset(`ip:${ip}`);
  }
};
