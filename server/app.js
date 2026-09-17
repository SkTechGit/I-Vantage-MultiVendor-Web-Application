import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./src/routes/index.js";
import errorHandler from "./src/middlewares/error.middleware.js";


const app = express();
dotenv.config();
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile native apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, allow requests from any local network IP or tunnels (trycloudflare.com, loca.lt)
      if (
        process.env.NODE_ENV !== "production" &&
        (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
         /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
         /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
         /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
         /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
         /^https?:\/\/.*\.trycloudflare\.com$/.test(origin) ||
         /^https?:\/\/.*\.loca\.lt$/.test(origin))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/v1", routes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to I-Vantage Business Hub API",
  });
});

export default app;
