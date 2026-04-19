import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";
import ProductVariant from "@/models/ProductVariant.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Extract sizes (new feature)
    const { sizes, ...productData } = body;

    // =========================
    // 1. CREATE PRODUCT (UNCHANGED)
    // =========================
    const newProduct = await Product.create(productData);

    // =========================
    // 2. CREATE VARIANTS (NEW BUT SAFE)
    // =========================
    if (Array.isArray(sizes) && sizes.length > 0) {
      const variants = sizes.map((size) => {
        const basePrice = newProduct.sellingPrice;

        return {
          product: newProduct._id,

          // SKU must be unique
          sku: `${newProduct.slug}-${size}-${Date.now()}`,

          size: size,

          stock: 10, // default stock (you can change later)

          mrp: newProduct.mrp,
          sellingPrice: basePrice,
          discountPercentage: newProduct.discountPercentage,
          finalPrice: basePrice,

          color: {
            name: "Default",
            hex: "#000000",
          },

          images: newProduct.images,
        };
      });

      await ProductVariant.insertMany(variants);
    }

    // =========================
    // 3. RESPONSE
    // =========================
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}