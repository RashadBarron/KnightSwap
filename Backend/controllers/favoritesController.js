import Favorite from "../models/Favorite.js";

// GET FAVORITES BY USER
export const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate({
        path: "listingId",
        populate: [
          { path: "sellerId", select: "username" },
          { path: "categoryId", select: "name" }
        ]
      })

    res.json(favorites)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET FAVORITE COUNT FOR LISTING
export const getFavoriteCount = async (req, res) => {
  try {
    const count = await Favorite.countDocuments({
      listingId: req.params.listingId,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Could not get favorite count",
      error: error.message,
    });
  }
};

// ADD FAVORITE
export const addFavorite = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({
        message: "userId and listingId are required",
      });
    }

    const newFavorite = new Favorite({ userId, listingId });
    const savedFavorite = await newFavorite.save();

    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({
      message: "Could not add favorite",
      error: error.message,
    });
  }
};

// REMOVE FAVORITE
export const removeFavorite = async (req, res) => {
  try {
    const removedFavorite = await Favorite.findOneAndDelete({
      userId: req.params.userId,
      listingId: req.params.listingId,
    });

    if (!removedFavorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not remove favorite",
      error: error.message,
    });
  }
};