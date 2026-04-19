// app/api/auth/verify-otp/route.js

import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/Users.model";
import OTPModel from "@/models/Otp.model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { zSchema } from "@/lib/zodSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const payload = await req.json();

    const validatedData = zSchema
      .pick({ email: true, otp: true })
      .safeParse(payload);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const { email, otp } = validatedData.data;

    const getOtpData = await OTPModel.findOne({ email });

    if (!getOtpData) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 404 }
      );
    }

    const isValidOtp = await bcrypt.compare(otp, getOtpData.otp);

    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      deletedAt: null,
      email,
    }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const loggedInUserData = {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    };

    // ✅ CREATE TOKEN
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT(loggedInUserData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // ✅ DELETE OTP
    await getOtpData.deleteOne();

    // ✅ CREATE RESPONSE
    const response = NextResponse.json(
      {
        success: true,
        message: "Login Successful",
        data: loggedInUserData,
      },
      { status: 200 }
    );

    // 🔥 ✅ CORRECT WAY TO SET COOKIE
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ important
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}