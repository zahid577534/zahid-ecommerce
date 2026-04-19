"use client"
import { CldUploadWidget } from 'next-cloudinary';
import { BsFolderPlus } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { showToast } from '@/lib/showToast'; // Ensure this supports .promise()
import axios from 'axios';

const UploadMedia = ({ isMultiple = false }) => {
    
    const handleOnError = (error) => {
        showToast("error", "Upload failed. Please try again.");
    };

    const handleOnSuccess = async (result, { widget }) => {
        const info = result.info; 
        
        const fileData = {
            asset_id: info.asset_id,
            public_id: info.public_id,
            secure_url: info.secure_url,
            thumbnail_url: info.thumbnail_url,
            path: info.path || "" 
        };

        // Create the promise for the database sync
        const saveToDatabase = axios.post('/api/media/create', [fileData]);

        // Use the promise-based toast for immediate feedback
        // If your showToast is custom, ensure it wraps toast.promise()
        showToast('promise', saveToDatabase, {
            loading: 'Cloudinary successful! Saving to database...',
            success: (res) => res.data.message || "Media saved successfully!",
            error: "Cloudinary finished, but database sync failed.",
        });

        try {
            const response = await saveToDatabase;
            
            if (response.data.success) {
                // For single uploads, wait 2 seconds so they see the success message
                if (!isMultiple) {
                    setTimeout(() => {
                        widget.close();
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Database sync error:", error);
            // Widget remains open so user can see the error toast
        }
    };

    return (
        <CldUploadWidget 
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleOnSuccess}
            onError={handleOnError}
            // onQueuesEnd is only for bulk cleanup; don't use it for single uploads
            onQueuesEnd={(result, { widget }) => {
                if (isMultiple) {
                    setTimeout(() => widget.close(), 1500);
                }
            }}
            options={{
                multiple: isMultiple,
                maxFiles: isMultiple ? 10 : 1,
                sources: ['local', 'url', 'unsplash', 'google_drive'],
                resourceType: "auto",
                // THE FIX: Prevent abrupt closing
                showCompletedButton: true,      // Shows "Done" button for manual close
                singleUploadAutoClose: false,   // Keeps widget open after 100% upload
                closeOnUploadQueuesComplete: false // Essential to keep UI alive for sync
            }}
        >
            {({ open, isLoading }) => (
                <Button 
                    type="button"
                    variant="outline"
                    disabled={isLoading} 
                    onClick={() => open()}
                >
                    <BsFolderPlus className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Upload Media"}
                </Button>
            )}
        </CldUploadWidget>
    );
}

export default UploadMedia;
