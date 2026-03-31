const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Could not load categories",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Could not load category",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description ? description.trim() : ""
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({
      message: "Could not create category",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description ? description.trim() : ""
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({
      message: "Could not update category",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete category",
      error: error.message
    });
  }
});

module.exports = router;
