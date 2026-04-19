// models/Customer.model.js
import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  avatar: { url: String },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const CustomerModel = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default CustomerModel;