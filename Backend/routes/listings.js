import express from "express";
import { requireToken } from "../config/auth.js";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingsController.js";

const router = express.Router();

// CREATE
router.post("/", requireToken, createListing);

// READ ALL
router.get("/", getListings);

// READ ONE
router.get("/:id", getListingById);

// UPDATE
router.put("/:id", requireToken, updateListing);

// DELETE
router.delete("/:id", requireToken, deleteListing);

export default router;