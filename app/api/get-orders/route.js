import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";

export async function GET() {
  await connectDB();

  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}