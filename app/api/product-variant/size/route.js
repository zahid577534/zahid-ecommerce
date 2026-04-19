import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import ProductVariantModel from "@/models/ProductVariant.model";

// =======================
// GET → Fetch unique sizes (sorted)
// =======================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // ✅ Step 1: Get distinct sizes
    let sizes = await ProductVariantModel.distinct("size");

    // ✅ Step 2: Optional search filter
    if (search) {
      sizes = sizes.filter(size =>
        size.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✅ Step 3: Define proper order
    const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "XXXL"];

    // ✅ Step 4: Sort sizes based on order
    sizes = sizes.sort((a, b) => {
      return (
        (sizeOrder.indexOf(a) === -1 ? 999 : sizeOrder.indexOf(a)) -
        (sizeOrder.indexOf(b) === -1 ? 999 : sizeOrder.indexOf(b))
      );
    });

    return NextResponse.json({
      success: true,
      data: sizes,
      meta: {
        totalRowCount: sizes.length,
      },
    });

  } catch (error) {
    console.error("GET SIZES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}