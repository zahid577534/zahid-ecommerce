import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import CouponModel from "@/models/Coupon.model";
import { addCouponSchema } from "@/lib/zodSchema";
import mongoose from "mongoose";

// ---------------- GET: List Coupons ----------------
export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const start = parseInt(url.searchParams.get("start")) || 0;
    const size = parseInt(url.searchParams.get("size")) || 10;

    // ✅ REMOVE deletedAt filter (since using permanent delete)
    const totalRowCount = await CouponModel.countDocuments();

    const data = await CouponModel.find()
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

// ---------------- POST: Add Coupon ----------------
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const validatedData = addCouponSchema.parse(body);

    validatedData.validity = new Date(validatedData.validity);

    const existing = await CouponModel.findOne({
      code: validatedData.code,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    const newCoupon = await CouponModel.create(validatedData);

    return NextResponse.json({
      success: true,
      data: newCoupon,
      message: "Coupon added successfully!",
    });

  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: error.errors.map(e => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ---------------- DELETE: Permanent Delete ----------------
export async function DELETE(req) {
  await connectDB();
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    // ✅ FIX: Convert string IDs → ObjectId
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

    const result = await CouponModel.deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon(s) deleted permanently",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}