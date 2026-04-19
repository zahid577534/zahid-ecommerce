// app/api/product-variant/create/route.jsx
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection"; // ✅ named import
import ProductVariant from "@/models/ProductVariant.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      product,
      sku,
      size,
      stock,
      mrp,
      sellingPrice,
      discountPercentage,
      finalPrice,
      color,
      images,
    } = body;

    // Validate required fields
    if (!product || !sku || !size || !stock || !mrp || !sellingPrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingSKU = await ProductVariant.findOne({ sku });
    if (existingSKU) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 400 }
      );
    }

    // Create new variant
    const newVariant = await ProductVariant.create({
      product,
      sku,
      size,
      stock,
      mrp,
      sellingPrice,
      discountPercentage,
      finalPrice,
      color,
      images,
    });

    return NextResponse.json({
      success: true,
      message: "Product variant created successfully",
      data: newVariant,
    });
  } catch (error) {
    console.error("Product Variant Creation Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create variant" },
      { status: 500 }
    );
  }
}