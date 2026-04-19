import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    // CHANGED: renamed from 'media' to 'images' to match your AddProduct frontend
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    }],
    description: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });

// Use the name "Product" consistently
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

export default Product;
