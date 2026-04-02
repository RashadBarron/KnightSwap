const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

router.get("/user/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({
      message: "Could not load favorites",
      error: error.message
    });
  }
});

router.get("/listing/:listingId/count", async (req, res) => {
  try {
    const count = await Favorite.countDocuments({
      listingId: req.params.listingId
    });

    res.status(200).json({ count: count });
  } catch (error) {
    res.status(500).json({
      message: "Could not get favorite count",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({
        message: "userId and listingId are required"
      });
    }

    const newFavorite = new Favorite({
      userId: userId,
      listingId: listingId
    });

    const savedFavorite = await newFavorite.save();
    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({
      message: "Could not add favorite",
      error: error.message
    });
  }
});

router.delete("/:userId/:listingId", async (req, res) => {
  try {
    const removedFavorite = await Favorite.findOneAndDelete({
      userId: req.params.userId,
      listingId: req.params.listingId
    });

    if (!removedFavorite) {
      return res.status(404).json({
        message: "Favorite not found"
      });
    }

    res.status(200).json({
      message: "Favorite removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not remove favorite",
      error: error.message
    });
  }
});

module.exports = router;
