import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./src/routes/index.js";
import errorHandler from "./src/middlewares/error.middleware.js";


const app = express();
dotenv.config();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
