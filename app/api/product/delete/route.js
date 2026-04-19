import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";

// ---------------- SOFT DELETE (Move to Trash) ----------------
export async function PUT(req) {
  try {
    await connectDB();

    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No product IDs provided" },
        { status: 400 }
      );
    }

    await Product.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      message: "Product moved to trash successfully",
    });

  } catch (error) {
    console.error("Soft Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}

// ---------------- PERMANENT DELETE ----------------
export async function DELETE(req) {
  try {
    await connectDB();

    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No product IDs provided" },
        { status: 400 }
      );
    }

    await Product.deleteMany({
      _id: { $in: ids },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted permanently",
    });

  } catch (error) {
    console.error("Permanent Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Permanent delete failed",
      },
      { status: 500 }
    );
  }
}