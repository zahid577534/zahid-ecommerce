import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import categoryModel from "@/models/Category.model";

// =======================
// GET → Fetch categories
// =======================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const search = searchParams.get("search") || "";

    // ✅ Query (with optional search)
    const query = {
      ...(search && {
        name: { $regex: search, $options: "i" },
      }),
    };

    const categories = await categoryModel
      .find(query)
      .skip(start)
      .limit(size)
      .sort({ createdAt: -1 })
      .lean();

    const totalRowCount = await categoryModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        totalRowCount,
        start,
        size,
      },
    });

  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}