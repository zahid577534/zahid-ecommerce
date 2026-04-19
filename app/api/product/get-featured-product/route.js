import { NextResponse } from "next/server"
import { connectDB } from "@/lib/databaseConnection"
import Product from "@/models/Product.model"
import "@/models/Media.model" // ✅ IMPORTANT (registers Media model)

export async function GET() {
  try {
    await connectDB()

    const products = await Product.find({})
      .populate('images') // now works ✅
      .limit(8)

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    )
  }
}