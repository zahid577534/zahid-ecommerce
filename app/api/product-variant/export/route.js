import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import ProductVariant from "@/models/ProductVariant.model";
import Product from "@/models/Product.model"; // needed for populate
import Media from "@/models/Media.model";     // needed for images

export async function GET(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const trash = url.searchParams.get("trash") === "true";

    // Filter: deleted items if trash=true
    const filter = trash ? { deletedAt: { $ne: null } } : { deletedAt: null };

    // Fetch all matching variants
    const variants = await ProductVariant.find(filter)
      .populate("product")
      .populate("images")
      .sort({ createdAt: -1 });

    // Map variants to CSV-friendly objects
    const exportData = variants.map((v) => ({
      SKU: v.sku,
      ProductName: v.product?.name || "",
      ColorName: v.color?.name || "",
      ColorHex: v.color?.hex || "",
      Size: v.size,
      Stock: v.stock,
      MRP: v.mrp,
      SellingPrice: v.sellingPrice,
      DiscountPercentage: v.discountPercentage,
      FinalPrice: v.finalPrice,
      Images: v.images?.map((img) => img.url || img.secure_url).join(", "),
      DeletedAt: v.deletedAt ? v.deletedAt.toISOString() : "",
      CreatedAt: v.createdAt ? v.createdAt.toISOString() : "",
      UpdatedAt: v.updatedAt ? v.updatedAt.toISOString() : "",
    }));

    return NextResponse.json({ success: true, data: exportData });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}