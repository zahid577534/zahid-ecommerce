
import { connectDB } from "@/lib/databaseConnection";
import OTPModel from "@/models/Otp.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP expired or not found" },
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

    return NextResponse.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}