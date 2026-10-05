import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./src/routes/index.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import { securityHeaders, noSqlSanitizer } from "./src/middlewares/security.middleware.js";
import { apiRateLimiter } from "./src/middlewares/rateLimit.middleware.js";

const app = express();
dotenv.config();

// Disable x-powered-by to prevent technology fingerprinting
app.disable("x-powered-by");

// Apply baseline security headers
app.use(securityHeaders);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://i-vantage.in",
  "https://www.i-vantage.in",
  "http://i-vantage.in",
  "http://www.i-vantage.in",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile native apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check explicitly configured allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any i-vantage.in domain / subdomain (e.g. i-vantage.in, www.i-vantage.in, admin.i-vantage.in)
      if (/^https?:\/\/([a-zA-Z0-9-]+\.)?i-vantage\.in(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview & production deployments
      if (/^https?:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow Cloudflare tunnels and local tunnels
      if (
        /^https?:\/\/.*\.trycloudflare\.com$/.test(origin) ||
        /^https?:\/\/.*\.loca\.lt$/.test(origin)
      ) {
        return callback(null, true);
      }

      // In local development, allow localhost, 127.0.0.1, and private LAN IPs
      if (
        process.env.NODE_ENV !== "production" &&
        (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
          /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
          /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
          /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-portal",
      "X-Portal",
      "x-refresh-token",
      "X-Refresh-Token",
    ],
    optionsSuccessStatus: 200,
  }),
);
app.use(cookieParser());
// Limit payload size to 10mb to protect against memory exhaustion attacks
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Anti-NoSQL injection and prototype pollution sanitizer
app.use(noSqlSanitizer);

// General volumetric rate limiter (300 requests / min per IP)
app.use(apiRateLimiter(300, 60 * 1000));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to I-Vantage Business Hub API",
  });
});

app.use("/api/v1", routes);
app.use(errorHandler);

export default app;
