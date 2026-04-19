// app/api/customers/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import User from "@/models/Users.model"; // your existing User model

// ---------------- GET: List Customers ----------------
export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const start = parseInt(url.searchParams.get("start")) || 0;
    const size = parseInt(url.searchParams.get("size")) || 10;

    // Count total customers
    const totalRowCount = await User.countDocuments({ role: "user" });

    // Fetch paginated customers
    const data = await User.find({ role: "user" })
      .skip(start)
      .limit(size)
      .sort({ createdAt: -1 })
      .lean(); // lean for faster queries

    return NextResponse.json({ success: true, data, meta: { totalRowCount } });
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ---------------- DELETE: Permanent Delete ----------------
export async function DELETE(req) {
  await connectDB();
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No IDs provided" }, { status: 400 });
    }

    // Only delete users with role "user"
    const result = await User.deleteMany({ _id: { $in: ids }, role: "user" });

    return NextResponse.json({
      success: true,
      message: `Customer(s) deleted permanently`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/customers error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}