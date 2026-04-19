

import { connectDB } from "@/lib/databaseConnection";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/Users.model";
import sendMail from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";
import { generateOTP } from "@/lib/helperFunction";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    await OTPModel.deleteMany({ email });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTPModel.create({
      email,
      otp: hashedOtp
    });

    await sendMail({
      to: email,
      subject: "Reset Password OTP",
      html: otpEmail(otp)
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}