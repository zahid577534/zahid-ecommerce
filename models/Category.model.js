import mongoose from "mongoose";
//import { unique } from "next/dist/build/utils";

const categorySchema = new mongoose.Schema(
  {
   name: {
      type: String,
      required: true,
      unique:true,
  },
   slug: {
      type: String,
      required: true,
      unique:true,
      lowercase:true,
      trim:true,
  },
  deletedAt: {
      type: Date,
      default:null,
      index:true,
  },
},
  { timestamps: true }
);



const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema, "category");

export default categoryModel;