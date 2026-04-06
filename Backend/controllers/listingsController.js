import mongoose from "mongoose";
import Listing from "../models/Listing.js";


// Helper: Authorization Logic
const canModifyListing = (user, listing) => {
  const userId = user._id?.toString() || user.id;
  return (
    listing.sellerId.toString() === userId ||
    user.role === "admin"
  );
};


// CREATE a new listing
export const createListing = async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id;

    const listing = new Listing({
      ...req.body,
      sellerId: userId, // enforce ownership from auth
    });

    await listing.save();
    await listing.populate("sellerId", "username");

    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET all listings
export const getListings = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = {};

    if (categoryId) filter.categoryId = categoryId;

    const listings = await Listing.find(filter)
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET listings by user
export const getListingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const listings = await Listing.find({ sellerId: userId })
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET single listing
export const getListingById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id)
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE listing (owner OR admin)
export const updateListing = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (!canModifyListing(req.user, listing)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Prevent ownership tampering
    const { sellerId, ...safeUpdates } = req.body;

    Object.assign(listing, safeUpdates);

    await listing.save();
    await listing.populate("sellerId", "username");

    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELETE listing (owner OR admin)
export const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (!canModifyListing(req.user, listing)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};