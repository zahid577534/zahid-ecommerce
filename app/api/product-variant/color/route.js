import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";
import { catchError } from "@/lib/helperFunction";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // ✅ FIX: resolve params safely
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    const searchParams = new URL(request.url).searchParams;
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // =========================
    // GET PRODUCT
    // =========================
    const getProduct = await ProductModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    if (!getProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // =========================
    // GET VARIANT
    // =========================
    const variantFilter = {
      product: getProduct._id,
      deletedAt: null,
    };

    if (size) variantFilter.size = size;
    if (color) variantFilter["color.name"] = color;

    let getVariant = await ProductVariantModel.findOne(variantFilter)
      .populate({
        path: "images",
        select: "secure_url",
        strictPopulate: false, // ✅ prevents crash
      })
      .lean();

    // ✅ fallback if no variant
    if (!getVariant) {
      getVariant = await ProductVariantModel.findOne({
        product: getProduct._id,
        deletedAt: null,
      }).lean();
    }

    if (!getVariant) {
      return NextResponse.json(
        { error: "No variants found for this product" },
        { status: 404 }
      );
    }

    // =========================
    // GET COLORS
    // =========================
    const getColors = await ProductVariantModel.aggregate([
      {
        $match: {
          product: getProduct._id,
          deletedAt: null,
          "color.name": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$color.name",
          name: { $first: "$color.name" },
          hex: { $first: "$color.hex" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          hex: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);

    // =========================
    // GET SIZES
    // =========================
    const getSizes = await ProductVariantModel.aggregate([
      {
        $match: {
          product: getProduct._id,
          deletedAt: null,
        },
      },
      { $group: { _id: "$size" } },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          size: "$_id",
        },
      },
    ]);

    // =========================
    // GET REVIEWS
    // =========================
    const reviewCount = await ReviewModel.countDocuments({
      product: getProduct._id,
      deletedAt: null,
    });

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      data: {
        product: getProduct,
        variant: getVariant,
        colors: getColors,
        sizes: getSizes.map((s) => s.size),
        reviews: reviewCount,
      },
    });

  } catch (error) {
    console.error("API ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}