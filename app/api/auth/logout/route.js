import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";

export async function POST() {
  try {
    await connectDB();

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // 🔥 PROPER WAY TO CLEAR COOKIE
    response.cookies.set("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    console.error("Logout Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}