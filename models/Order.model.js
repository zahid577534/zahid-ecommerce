import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      // 🔥 ADD THIS (MOST IMPORTANT)
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },
    },

    products: [
      {
        name: String,
        quantity: Number,
        sellingPrice: Number,
        variantId: String,
        media: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);