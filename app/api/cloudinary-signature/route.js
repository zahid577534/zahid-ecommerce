
import cloudinary from '@/lib/cloudinary';
// 1. Updated import name to match helperFunction.js
import { catchError } from "@/lib/helperFunction"; 
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        // Ensure this matches your .env variable name
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY;

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign, 
            apiSecret
        );

        return NextResponse.json({ signature });
    } catch (error) {
        console.error("Signature Error:", error);
        // 2. Updated function call to match the new helper name
        return catchError(error); 
    }
}
