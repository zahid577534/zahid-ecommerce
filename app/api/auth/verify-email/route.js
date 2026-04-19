
import { connectDB } from "@/lib/databaseConnection"
import User from "@/models/Users.model"
import { jwtVerify } from "jose"
import { NextResponse } from "next/server"
import { isValidObjectId } from "mongoose"

export async function POST(req) {
  try {
    const { token } = await req.json()
    if (!token || typeof token !== "string") {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
    }

    if (!process.env.SECRET_KEY) throw new Error("SECRET_KEY not defined")
    const secret = new TextEncoder().encode(process.env.SECRET_KEY)

    let decoded
    try { decoded = await jwtVerify(token, secret) }
    catch (err) {
      console.error("JWT verification error:", err)
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 })
    }

    const userId = decoded.payload.userId
    if (!isValidObjectId(userId)) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })

    if (user.isEmailVerified) {
      return NextResponse.json({ success: true, message: "Email already verified" }, { status: 200 })
    }

    user.isEmailVerified = true
    await user.save()

    return NextResponse.json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    console.error("Server verification error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}