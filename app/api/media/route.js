import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { response, catchError } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { NextResponse } from "next/server";

/* ================= GET ================= */
export async function GET(req) {
  try {
    // ✅ FIX: pass req
    const auth = await isAuthenticated(req, 'admin');
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized');
    }

    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page'), 10) || 0;
    const limit = parseInt(searchParams.get('limit'), 10) || 10;
    const deleteType = searchParams.get('deleteType');

    let filter = {};

    if (deleteType === 'SD') {
      filter = { deletedAt: null };
    } else if (deleteType === 'PD') {
      filter = { deletedAt: { $ne: null } };
    }

    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();

    const totalMedia = await MediaModel.countDocuments(filter);

    return NextResponse.json({
      success: true,
      mediaData,
      hasMore: (page + 1) * limit < totalMedia,
      nextPage: page + 1,
    });
  } catch (error) {
    return catchError(error);
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    // ✅ FIX: pass req
    const auth = await isAuthenticated(req, 'admin');
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorized');
    }

    await connectDB();

    const { ids, deleteType } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, 'No media IDs provided');
    }

    if (deleteType === 'SD') {
      // Soft Delete
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
    } else {
      // Permanent Delete
      await MediaModel.deleteMany({ _id: { $in: ids } });
    }

    return NextResponse.json({
      success: true,
      message:
        deleteType === 'SD'
          ? "Moved to trash"
          : "Permanently deleted",
    });
  } catch (error) {
    return catchError(error);
  }
}