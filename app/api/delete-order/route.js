import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";

export async function DELETE(req) {
  await connectDB();

  try {
    const { orderId } = await req.json();

    await OrderModel.findByIdAndDelete(orderId);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}