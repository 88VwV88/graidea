import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";

export const app = express();
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
