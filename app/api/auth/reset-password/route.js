import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/Users.model";
import OTPModel from "@/models/Otp.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP required" },
        { status: 400 }
      );
    }

    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ Get user
    const user = await UserModel.findOne({ email });

    // ✅ Delete OTP after success
    await OTPModel.deleteMany({ email });

    // ✅ Create JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({
      _id: user._id.toString(),
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // ✅ Set cookie
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: false, // ⚠️ true in production
      sameSite: "lax",
      path: "/",
    });

    return res;

  } catch (error) {
    console.error("Login OTP error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}