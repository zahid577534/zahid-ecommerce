import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import ProductVariant from "@/models/ProductVariant.model";
import Product from "@/models/Product.model";
import Media from "@/models/Media.model";

// ----------------- GET -----------------
export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const start = parseInt(url.searchParams.get("start")) || 0;
    const size = parseInt(url.searchParams.get("size")) || 10;

    // ✅ NO soft delete filter anymore
    const totalRowCount = await ProductVariant.countDocuments();

    const data = await ProductVariant.find()
      .populate("product")
      .populate("images")
      .skip(start)
      .limit(size)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data,
      meta: { totalRowCount },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ----------------- DELETE (Permanent Delete) -----------------
export async function DELETE(req) {
  await connectDB();
  try {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    const result = await ProductVariant.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted permanently",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}