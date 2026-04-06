import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireToken, requireAdmin } from "../config/auth.js";

const router = express.Router();

// READ (everyone can see)
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// CREATE, UPDATE, DELETE → admins only
router.post("/", requireToken, requireAdmin, createCategory);
router.put("/:id", requireToken, requireAdmin, updateCategory);
router.delete("/:id", requireToken, requireAdmin, deleteCategory);

export default router;