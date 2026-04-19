import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";
import { isAuthenticated } from "@/lib/authentication"; // ✅ ADD THIS

export async function POST(req) {
  await connectDB();

  try {
    // ✅ AUTH USER
    const auth = await isAuthenticated(req, "user");

    if (!auth?.isAuth || !auth?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { customer, products, total, paymentMethod } = body;

    if (!customer || !products?.length) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    // 🔥 CREATE ORDER WITH USER ID
    const order = await OrderModel.create({
      customer: {
        ...customer,
        userId: auth.user._id, // ✅ CRITICAL FIX
      },
      products,
      total,
      paymentMethod,

      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}