import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET = process.env.JWT_SECRET || "unique secrets";
const TOKEN_EXPIRATION = 36000; // 10 hours

// Middleware
export const requireToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, SECRET);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = {
      id: user._id.toString(),
      role: user.role,
      username: user.username,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// CREATE TOKEN
export const createUserToken = (user) => {
  if (!user) throw new Error("Cannot create token for invalid user");

  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

// require admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized: no user" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden: admin only" });
  next();
};

// ownership check
export const handleValidateOwnership = (req, document, field = "sellerId") => {
  const ownerId = document[field]?._id?.toString() || document[field]?.toString();
  if (req.user.id !== ownerId && req.user.role !== "admin") throw new Error("Unauthorized Access");
  return document;
};