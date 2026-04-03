import express from "express";
import "../config/db.connection.js";
import authRoutes from "./authentication.js";
import listingsRoutes from "./listings.js";
import categoriesRoutes from "./categories.js";
import favoritesRoutes from "./favorites.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/listings", listingsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/favorites", favoritesRoutes);

export default router;