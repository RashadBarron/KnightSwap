import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { connectDB } from "./config/db.connection.js"; // <-- import modular DB connection
import dotenv from "dotenv";

dotenv.config(); // load environment variables

const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", routes);

// Connect to MongoDB, then start server
async function startServer() {
  try {
    await connectDB(); // ensures Mongoose is connected before any request
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB connection error:", err);
  }
}

startServer();