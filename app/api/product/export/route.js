import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Product from "@/models/Product.model";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ deletedAt: null })
      .populate("category", "name");

    const data = products.map((p) => ({
      Name: p.name,
      Slug: p.slug,
      Category: p.category?.name || "",
      MRP: p.mrp,
      SellingPrice: p.sellingPrice,
      Discount: p.discountPercentage,
      CreatedAt: p.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Export error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Export failed"
      },
      { status: 500 }
    );
  }
}