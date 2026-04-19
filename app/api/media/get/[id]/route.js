
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { response, catchError } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

// GET MEDIA
export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await connectDB();

    // NEXT 15 FIX
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Media ID");
    }

    const media = await MediaModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!media) {
      return response(false, 404, "Media not found");
    }

    return response(true, 200, "Success", media);
  } catch (error) {
    return catchError(error);
  }
}

// UPDATE MEDIA
export async function PUT(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await connectDB();

    // NEXT 15 FIX
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Media ID");
    }

    const body = await req.json();

    const updated = await MediaModel.findByIdAndUpdate(
      id,
      {
        title: body.title,
        alt: body.alt,
        url: body.url,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return response(false, 404, "Media not found");
    }

    return response(true, 200, "Media updated", updated);
  } catch (error) {
    return catchError(error);
  }
}