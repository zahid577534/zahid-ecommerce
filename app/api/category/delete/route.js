import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Category from "@/models/Category.model";

export async function PUT(req) {
  try {
    await connectDB();

    const { ids, deleteType } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    if (deleteType === "SD") {
      // Soft delete: move to trash
      await Category.updateMany(
        { _id: { $in: ids } },
        { deletedAt: new Date() }
      );
      return NextResponse.json({ success: true, message: "Moved to trash successfully" });
    } else if (deleteType === "PD") {
      // Permanent delete: remove from database
      await Category.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, message: "Deleted permanently" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid deleteType" }, { status: 400 });
    }

  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}