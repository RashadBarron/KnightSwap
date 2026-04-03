import Listing from "../models/Listing.js";

// CREATE listing
export const createListing = async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      sellerId: req.user.id,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all listings (with optional filtering)
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

// GET single listing
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    if (!listing) return res.status(404).json({ error: "Not found" });

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE listing (owner only)
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Not found" });

    // Ownership check
    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE listing (owner OR admin)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Not found" });

    if (listing.sellerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};