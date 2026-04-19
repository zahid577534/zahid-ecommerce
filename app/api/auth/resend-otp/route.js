
import { connectDB } from "@/lib/databaseConnection";
import OTPModel from "@/models/Otp.model";
import sendMail from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";
import { generateOTP } from "@/lib/helperFunction";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    // Check existing OTP
    const existingOtp = await OTPModel.findOne({ email });

    if (existingOtp) {
      const diff = Date.now() - new Date(existingOtp.createdAt).getTime();

      if (diff < 60 * 1000) {
        return NextResponse.json(
          { success: false, message: "Please wait 60 seconds before requesting another OTP" },
          { status: 429 }
        );
      }

      await OTPModel.deleteMany({ email });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTPModel.create({
      email,
      otp: hashedOtp,
      createdAt: new Date(),
    });

    const mailStatus = await sendMail({
      to: email,
      subject: "Your verification code",
      html: otpEmail(otp),
    });

    if (!mailStatus.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "OTP resent to your email" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}