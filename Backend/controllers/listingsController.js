import mongoose from "mongoose";
import Listing from "../models/Listing.js";

// CREATE a new listing (requires authentication)
export const createListing = async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      sellerId: req.user._id, // set sellerId from logged-in user
    });

    await listing.save();
    await listing.populate("sellerId", "username"); // populate seller info
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message }); // validation errors
  }
};

// GET all listings; optional query: ?categoryId=<id>
export const getListings = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = categoryId; // optional category filter

    const listings = await Listing.find(filter)
      .populate("sellerId", "username")
      .populate("categoryId", "name"); // populate relations

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message }); // server error
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

// GET single listing by ID
export const getListingById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" }); // validate ID
    }

    const listing = await Listing.findById(id)
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    if (!listing) return res.status(404).json({ error: "Listing not found" }); // not found

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message }); // server error
  }
};

// UPDATE listing (owner or admin)
export const updateListing = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" }); // validate ID
    }

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" }); // not found

    if (!listing.sellerId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" }); // ownership check
    }

    Object.assign(listing, req.body);
    await listing.save();
    await listing.populate("sellerId", "username"); // populate seller info

    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message }); // validation/server error
  }
};

// DELETE listing (owner or admin)
export const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" }); // validate ID
    }

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" }); // not found

    if (!listing.sellerId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" }); // ownership check
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ error: err.message }); // server error
  }
};