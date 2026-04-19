import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import ProductVariant from "@/models/ProductVariant.model";

export async function PUT(req) {
  await connectDB();
  try {
    const { ids, deleteType } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    if (deleteType === "SD") {
      const result = await ProductVariant.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return NextResponse.json({ success: true, message: "Moved to trash", modifiedCount: result.modifiedCount });
    } else if (deleteType === "PD") {
      const result = await ProductVariant.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, message: "Deleted permanently", deletedCount: result.deletedCount });
    } else {
      return NextResponse.json({ success: false, message: "Invalid delete type" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}