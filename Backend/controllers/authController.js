import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createUserToken, requireToken } from "../config/auth.js";

// SIGN UP
export const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const pwStore = req.body.password;

    req.body.password = passwordHash;
    const newUser = await User.create(req.body);

    if (newUser) {
      req.body.password = pwStore;
      const token = createUserToken(req, newUser);
      res.status(201).json({
        user: newUser,
        isLoggedIn: true,
        token,
      });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// SIGN IN
export const loginUser = async (req, res) => {
  try {
    const loggingUser = req.body.username;
    const foundUser = await User.findOne({ username: loggingUser });
    if (!foundUser) throw new Error("User not found");

    const token = await createUserToken(req, foundUser);
    res.status(200).json({
      user: foundUser,
      isLoggedIn: true,
      token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// SIGN OUT
export const logoutUser = async (req, res) => {
  try {
    const currentUser = req.user.username;
    delete req.user;
    res.status(200).json({
      message: `${currentUser} currently logged out`,
      isLoggedIn: false,
      token: "",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};