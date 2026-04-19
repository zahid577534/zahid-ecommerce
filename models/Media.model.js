import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    secure_url: { // Added this as your API payload sends it
      type: String,
      required: true,
      trim: true
    },
    path: {
      type: String,
      required: false, // Cloudinary 'path' is sometimes undefined depending on folder setup
      trim: true
    },
    thumbnail_url: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String, // Fixed: changed 'string' to 'String'
      trim: true,
    },
    title: {
      type: String,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    },
  },
  { timestamps: true }
);

const MediaModel = mongoose.models.Media || mongoose.model("Media", mediaSchema, "medias");

export default MediaModel;
