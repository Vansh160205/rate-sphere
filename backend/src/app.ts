import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import router from "./routes";

dotenv.config();

const app: Application = express();
// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Frontend URLs
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ API is running" });
});

export default app;
