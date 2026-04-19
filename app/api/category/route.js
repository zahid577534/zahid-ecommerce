import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import categoryModel from "@/models/Category.model";

// =======================
// GET → Fetch categories
// =======================
export async function GET(req) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    // Only fetch non-deleted items
    const query = {};

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
      meta: { totalRowCount },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// =======================
// PUT → Permanent Delete
// =======================
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or empty IDs" },
        { status: 400 }
      );
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    // Permanent Delete only
    const result = await categoryModel.deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({
      success: true,
      message: `Permanently deleted ${result.deletedCount} item(s)`,
    });
  } catch (error) {
    console.error("PUT API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}