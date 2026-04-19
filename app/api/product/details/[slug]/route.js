import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";

import "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // ✅ FIX: unwrap params (Next.js 16+)
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    const searchParams = new URL(request.url).searchParams;
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    console.log("Slug 👉", slug, "Size 👉", size, "Color 👉", color);

    if (!slug) {
      return NextResponse.json(
        { error: "Slug required" },
        { status: 400 }
      );
    }

    // =========================
    // GET PRODUCT
    // =========================
    const product = await ProductModel.findOne({
      slug,
      deletedAt: null,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // =========================
    // GET VARIANTS
    // =========================
    const variants = await ProductVariantModel.find({
      product: product._id,
      deletedAt: null,
    })
      .populate("images", "secure_url")
      .lean();

    // =========================
    // NORMALIZE FUNCTION
    // =========================
    const normalize = (val) =>
      val?.toLowerCase().trim();

    // =========================
    // FIND SELECTED VARIANT
    // =========================
    let selectedVariant = null;

    if (variants.length > 0) {
      // 1️⃣ Exact match (size + color)
      if (size || color) {
        selectedVariant = variants.find((v) => {
          const matchSize = size
            ? normalize(v.size) === normalize(size)
            : true;

          const matchColor = color
            ? normalize(v.color?.name) === normalize(color)
            : true;

          return matchSize && matchColor;
        });

        // 2️⃣ Fallback → same SIZE
        if (!selectedVariant && size) {
          selectedVariant = variants.find(
            (v) =>
              normalize(v.size) === normalize(size)
          );
        }

        // 3️⃣ Fallback → same COLOR
        if (!selectedVariant && color) {
          selectedVariant = variants.find(
            (v) =>
              normalize(v.color?.name) === normalize(color)
          );
        }
      }

      // 4️⃣ Final fallback → first variant
      if (!selectedVariant) {
        selectedVariant = variants[0];
      }
    }

    // =========================
    // COLORS
    // =========================
    const colors = [
      ...new Map(
        variants.map((v) => [
          v.color.name,
          {
            name: v.color.name,
            hex: v.color.hex,
          },
        ])
      ).values(),
    ];

    // =========================
    // SIZES
    // =========================
    const sizes = [
      ...new Set(variants.map((v) => v.size)),
    ];

    // =========================
    // REVIEWS
    // =========================
    const reviewCount = await ReviewModel.countDocuments({
      product: product._id,
      deletedAt: null,
    });

    // =========================
    // RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      data: {
        product,
        variants,
        variant: selectedVariant,
        colors,
        sizes,
        reviews: reviewCount,
      },
    });

  } catch (error) {
    console.error("API ERROR 👉", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}