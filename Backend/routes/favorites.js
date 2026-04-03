import express from "express";
import {
  getFavoritesByUser,
  getFavoriteCount,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/user/:userId", getFavoritesByUser);
router.get("/listing/:listingId/count", getFavoriteCount);
router.post("/", addFavorite);
router.delete("/:userId/:listingId", removeFavorite);

export default router;