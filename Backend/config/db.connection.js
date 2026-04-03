import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { ATLAS_URI } = process.env;
if (!ATLAS_URI) throw new Error("ATLAS_URI not set in .env");

mongoose.set("strictQuery", true);

// Connection event handlers
mongoose.connection.on("open", () =>
  console.log(`[${new Date().toLocaleTimeString()}] - MongoDB connected ... 🙌 🙌 🙌`)
);
mongoose.connection.on("close", () =>
  console.log(`[${new Date().toLocaleTimeString()}] - MongoDB disconnected ⚡️ 🔌 ⚡️`)
);
mongoose.connection.on("error", (err) =>
  console.log(`[${new Date().toLocaleTimeString()}] - MongoDB connection error 😥`, err)
);

// Modern Mongoose connect (no useNewUrlParser / useUnifiedTopology)
export async function connectDB() {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log("Mongoose connection established ✅");
  } catch (err) {
    console.error("Failed to connect to MongoDB ❌", err);
    throw err;
  }
}