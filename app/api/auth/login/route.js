import { connectDB } from "@/lib/databaseConnection";
import User from "@/models/Users.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import OTPModel from "@/models/Otp.model";
import sendMail from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";
import { generateOTP } from "@/lib/helperFunction";
import { SignJWT } from "jose";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: "Email not verified" },
        { status: 400 }
      );
    }

    // ✅ DELETE OLD OTPs
    await OTPModel.deleteMany({ email });

    // ✅ GENERATE OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTPModel.create({ email, otp: hashedOtp });

    // ✅ SEND EMAIL
    const mailStatus = await sendMail({
      to: email,
      subject: "Your OTP code",
      html: otpEmail(otp),
    });

    if (!mailStatus.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP" },
        { status: 500 }
      );
    }

    // IMPORTANT CHANGE:
    // DO NOT ISSUE FULL AUTH TOKEN YET
    // Instead send temporary flag

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      email,
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}