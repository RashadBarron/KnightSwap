const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        enum: ["New", "Like New", "Used", "Fair"],
        default: "Used"
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);