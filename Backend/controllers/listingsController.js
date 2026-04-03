import Listing from "../models/Listing.js";

// CREATE a new listing
// Requires authentication (req.user set by requireToken)
export const createListing = async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      sellerId: req.user._id, // use _id to satisfy required field
    });

    await listing.save();

    // populate seller info for response
    await listing.populate("sellerId", "username");

    res.status(201).json(listing);
  } catch (err) {
    // 400 for validation errors
    res.status(400).json({ error: err.message });
  }
};

// GET all listings; Optional query: ?categoryId=<id>
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

// GET single listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("sellerId", "username")
      .populate("categoryId", "name");

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE listing (owner only or admin)
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Ownership check
    if (!listing.sellerId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    Object.assign(listing, req.body);
    await listing.save();

    // populate seller info for response
    await listing.populate("sellerId", "username");

    res.json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE listing (owner or admin)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Ownership check
    if (!listing.sellerId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};