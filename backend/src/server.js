import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.route.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
  }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: "Too many requests, please try after some time",
});

app.use(limiter);

app.use("/api/url", urlRoutes);
app.use("/", urlRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
  