import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json(
      { success: true, message: "Database connection successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}