import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Config
const SECRET = process.env.JWT_SECRET || "unique secrets";
const TOKEN_EXPIRATION = 36000; // seconds (10 hours)


// MIDDLEWARE: REQUIRE TOKEN
export const requireToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, SECRET);

    // Fetch fresh user from DB (prevents stale roles)
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Normalize user object (important for consistency)
    req.user = {
      id: user._id.toString(),
      role: user.role,
      username: user.username,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};


// CREATE TOKEN FUNCTION (LOGIN)
export const createUserToken = async (req, user) => {
  if (!user || !req.body.password) {
    const error = new Error("The provided username or password is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!passwordMatch) {
    const error = new Error("The provided username or password is incorrect");
    error.statusCode = 422;
    throw error;
  }

  // Include role in JWT
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};


// OPTIONAL: ADMIN-ONLY MIDDLEWARE
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};


// OPTIONAL: GENERIC OWNERSHIP CHECK
export const handleValidateOwnership = (req, document, field = "sellerId") => {
  const ownerId =
    document[field]?._id?.toString() ||
    document[field]?.toString();

  if (req.user.id !== ownerId && req.user.role !== "admin") {
    throw new Error("Unauthorized Access");
  }

  return document;
};