import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";

import "@/models/Category.model";

// =======================
// GET → Fetch products
// =======================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const start = parseInt(searchParams.get("start")) || 0;
    const size = parseInt(searchParams.get("size")) || 10;
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");

    let query = {};

    // Global search
    if (globalFilter) {
      query.$or = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column filters
    if (filters.length > 0) {
      filters.forEach((filter) => {
        query[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      });
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sorting.length > 0) {
      sort = {
        [sorting[0].id]: sorting[0].desc ? -1 : 1,
      };
    }

    const totalRowCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      // ❌ REMOVED: .populate("images")
      .sort(sort)
      .skip(start)
      .limit(size)
      .lean(); // ✅ important

    return NextResponse.json({
      success: true,
      data: products,
      meta: { totalRowCount },
    });

  } catch (error) {
    console.error("Product Fetch Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
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

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No products selected",
        },
        { status: 400 }
      );
    }

    const result = await Product.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      message: `Permanently deleted ${result.deletedCount} product(s)`,
    });

  } catch (error) {
    console.error("Product Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete products",
      },
      { status: 500 }
    );
  }
}