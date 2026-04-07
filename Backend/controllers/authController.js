import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createUserToken, requireToken } from "../config/auth.js";

// SIGN UP
export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({ ...req.body, password: passwordHash });

    const token = createUserToken(newUser); // safe now
    res.status(201).json({ user: newUser, isLoggedIn: true, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// SIGN IN
export const loginUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) throw new Error("User not found");

    const validPassword = await bcrypt.compare(req.body.password, foundUser.password);
    if (!validPassword) throw new Error("The provided username or password is incorrect");

    const token = createUserToken(foundUser); // now safe
    res.status(200).json({ user: foundUser, isLoggedIn: true, token });
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