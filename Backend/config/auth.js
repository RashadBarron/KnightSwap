import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Config
const SECRET = process.env.JWT_SECRET || 'unique secrets';
const TOKEN_EXPIRATION = 36000; // seconds (10 hours)

// MIDDLEWARE TO REQUIRE TOKEN
export const requireToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, SECRET);

    // Attach user to request
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// CREATE TOKEN FUNCTION
export const createUserToken = async (req, user) => {
  if (!user || !req.body.password) {
    const error = new Error('The provided username or password is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    const error = new Error('The provided username or password is incorrect');
    error.statusCode = 422;
    throw error;
  }

  // Generate JWT
  return jwt.sign({ id: user._id }, SECRET, { expiresIn: TOKEN_EXPIRATION });
};

// VALIDATE DOCUMENT OWNERSHIP
export const handleValidateOwnership = (req, document) => {
  const ownerId = document.owner._id || document.owner;
  if (!req.user._id.equals(ownerId)) {
    throw new Error('Unauthorized Access');
  }
  return document;
};