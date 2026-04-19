import { connectDB } from '@/lib/databaseConnection';
import { response } from '@/lib/helperFunction';
import MediaModel from '@/models/Media.model';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { isAuthenticated } from '@/lib/authentication';

/* ================= GET ================= */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const deleteType = searchParams.get('deleteType') || 'SD';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const query =
      deleteType === 'PD'
        ? { deletedAt: { $ne: null } }
        : { deletedAt: null };

    const mediaData = await MediaModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await MediaModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      mediaData,
      hasMore: total > page * limit,
      nextPage: page + 1,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */
export async function PUT(request) {
  try {
    const auth = await isAuthenticated(request, 'admin'); // ✅ FIXED
    if (!auth.isAuth) return response(false, 403, 'Unauthorized');

    await connectDB();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, 'Invalid IDs');

    const updateValue =
      deleteType === 'SD' ? new Date() : null;

    await MediaModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt: updateValue } }
    );

    return response(
      true,
      200,
      deleteType === 'SD'
        ? 'Moved to trash'
        : 'Restored successfully'
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(request) {
  try {
    const auth = await isAuthenticated(request, 'admin'); // ✅ FIXED
    if (!auth.isAuth) return response(false, 403, 'Unauthorized');

    await connectDB();

    const { ids, deleteType } = await request.json();

    if (deleteType !== 'PD')
      return response(false, 400, 'Invalid delete type');

    const media = await MediaModel.find({
      _id: { $in: ids },
    }).lean();

    if (!media.length)
      return response(false, 404, 'No media found');

    const publicIds = media
      .map((m) => m.public_id)
      .filter(Boolean);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    await MediaModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, 'Deleted permanently');
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(request) {
  try {
    const auth = await isAuthenticated(request, 'admin'); // ✅ FIXED
    if (!auth.isAuth) return response(false, 403, 'Unauthorized');

    await connectDB();

    const data = await request.json();

    const newMedia = await MediaModel.create({
      ...data,
      deletedAt: null,
    });

    return NextResponse.json({
      success: true,
      media: newMedia,
      message: 'Media saved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}