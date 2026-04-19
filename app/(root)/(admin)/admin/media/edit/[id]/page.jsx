"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { useForm } from "react-hook-form";
import axios from "axios";
import Script from "next/script";

const EditMediaPage = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  console.log("MEDIA ID:", id);

  const { data, loading, error, refetch } = useFetch(
    id ? `/api/media/get/${id}` : null
  );

  // ✅ actual media data from API response
  const mediaData = data?.data;

  // ✅ react-hook-form
  const form = useForm({
    defaultValues: {
      title: "",
      alt: "",
    },
  });

  const [imageUrl, setImageUrl] = useState("");

  // ✅ populate form when media loads
  useEffect(() => {
    if (mediaData) {
      form.reset({
        title: mediaData.title,
        alt: mediaData.alt || "",
      });

      setImageUrl(mediaData.url || "");
    }
  }, [mediaData, form]);

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "your-cloud-name",
        uploadPreset: "your-upload-preset",
        multiple: false,
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  const onSubmit = async (values) => {
    try {
      await axios.put(`/api/media/get/${id}`, {
        title: values.title,
        alt: values.alt,
        url: imageUrl,
      });

      alert("Media updated successfully");

      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mediaData) return <p>Media not found</p>;

  return (
    <div className="p-6">
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />

      <h1 className="text-2xl font-bold mb-6">Edit Media</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <div>
          <label className="block mb-1">Title</label>
          <input
            {...form.register("title")}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Alt</label>
          <input
            {...form.register("alt")}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Image</label>

          <button
            type="button"
            onClick={openCloudinaryWidget}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Upload Image
          </button>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-3 w-40 border"
            />
          )}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditMediaPage;