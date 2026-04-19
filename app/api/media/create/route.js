
import { isAuthenticated } from '@/lib/authentication';
import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/databaseConnection';
// Combined Import (Removed line 4 entirely)
import { catchError, response } from '@/lib/helperFunction'; 
import MediaModel from '@/models/Media.model'; 

export async function POST(req) {
    let payload;
    try {
        payload = await req.json();
        const auth = await isAuthenticated(req, 'admin');
        if (!auth.isAuth) return response(false, 403, 'Unauthorized');

        await connectDB();
        
        // Ensure payload is an array for insertMany
        const dataToSave = Array.isArray(payload) ? payload : [payload];
        const newMedia = await MediaModel.insertMany(dataToSave);
        
        return response(true, 200, 'Media saved to database', newMedia);

    } catch (error) {
        // CLEANUP LOGIC: If DB fails, remove files from Cloudinary
        if (payload && Array.isArray(payload)) {
            const publicIds = payload.map(data => data.public_id);
            try {
                // NOTE: This only deletes IMAGES by default. 
                // If you upload videos, you must call this again with { resource_type: 'video' }
                await cloudinary.api.delete_resources(publicIds);
            } catch (deleteError) {
                console.error("Cleanup failed:", deleteError);
            }
        }
        return catchError(error);
    }
}
