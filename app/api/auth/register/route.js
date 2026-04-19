
import { connectDB } from "@/lib/databaseConnection";
import User from "@/models/Users.model";
import sendMail from "@/lib/sendMail";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { toast } from "react-toastify";

export async function POST(req) {
  await connectDB();
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password,
      isEmailVerified: false
    });

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    await sendMail({
      to: normalizedEmail,
      subject: "Verify your email",
      html: `<p>Hello ${name},</p>
             <p>Click below to verify:</p>
             <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}">Verify Email</a>`
    });

    return NextResponse.json({ success: true, message: "Registered successfully. Check your email." });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

    