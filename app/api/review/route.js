import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import Review from "@/models/Review.model";
import User from "@/models/Users.model"; // ✅ ADD THIS
import { isAuthenticated } from "@/lib/authentication";
import mongoose from "mongoose";


/* ================= POST ================= */
export async function POST(req) {
  await connectDB();

  try {
    const auth = await isAuthenticated(req);

    if (!auth?.isAuth || !auth?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = auth.user;

    const { product, rating, review } = await req.json();

    if (!product || !rating || !review) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const existing = await Review.findOne({
      user: user._id,
      product: new mongoose.Types.ObjectId(product),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "You already reviewed this product" },
        { status: 400 }
      );
    }

    // ✅ ONLY ONE DECLARATION HERE
    const newReview = await Review.create({
      user: user._id,
      product: new mongoose.Types.ObjectId(product),
      rating,
      review,
    });

    return NextResponse.json({
      success: true,
      data: newReview,
    });

  } catch (error) {
    console.error("POST REVIEW ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= GET ================= */
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("productId");
    const start = parseInt(searchParams.get("start")) || 0;
    const size = parseInt(searchParams.get("size")) || 10;
    const isExport = searchParams.get("export") === "true";

    const filter = productId
      ? { product: new mongoose.Types.ObjectId(productId) }
      : {};

    const totalRowCount = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate("user", "name")
      .populate("product", "title")
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(isExport ? 0 : size)
      .lean();

    // ✅ CSV EXPORT
    if (isExport) {
      const csv = [
        ["User", "Product", "Rating", "Review", "Date"],
        ...reviews.map((r) => [
          r.user?.name || "N/A",
          r.product?.title || "N/A",
          r.rating,
          r.review,
          new Date(r.createdAt).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=reviews.csv",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: { totalRowCount },
    });

  } catch (error) {
    console.error("GET REVIEW ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  await connectDB();

  try {
    const auth = await isAuthenticated(req);

    // ✅ Optional: protect delete (recommended)
    if (!auth?.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    await Review.deleteMany({
      _id: {
        $in: ids.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reviews deleted successfully",
    });

  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}