"use client"

import * as Checkbox from '@radix-ui/react-checkbox';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon } from '@radix-ui/react-icons';
import { PiDotsThreeCircleVerticalFill } from "react-icons/pi";
import { MdModeEditOutline, MdDelete, MdLink } from "react-icons/md";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminRoute';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '@/lib/showToast';

const Media = ({ media, selectedMedia = [], setSelectedMedia, deleteType = 'SD', onDelete }) => {
  const transparentPixel =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const imageUrl = media?.secure_url || media?.thumbnail_url || transparentPixel;
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(media?.secure_url || media?.thumbnail_url || transparentPixel);
  }, [media]);

  const isSelected = selectedMedia?.includes(media?._id);

  const handleCheck = (checked) => {
    if (!setSelectedMedia) return;
    if (checked) {
      setSelectedMedia((prev) => [...prev, media._id]);
    } else {
      setSelectedMedia((prev) => prev.filter((id) => id !== media._id));
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(media._id);
      showToast("Media deleted"); // Red toast
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(media?.secure_url || media?.thumbnail_url || '');
      toast.success("Link copied to clipboard"); // Green toast
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link"); // Red toast
    }
  };

  const handleEdit = () => {
    toast.info("Edit opened"); // Blue/info toast
  };

  return (
    <div className="relative border border-gray-200 rounded overflow-hidden h-[200px] bg-gray-50 dark:bg-gray-800 group">

      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox.Root
          className="flex h-5 w-5 items-center justify-center rounded bg-white border border-gray-300 shadow-sm data-[state=checked]:bg-blue-600"
          checked={isSelected}
          onCheckedChange={handleCheck}
        >
          <Checkbox.Indicator className="text-white">
            <CheckIcon className="w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      {/* Dropdown menu */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className='w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer'>
              <PiDotsThreeCircleVerticalFill className='text-white' />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='start'>
            {deleteType === 'SD' && (
              <DropdownMenuItem asChild>
                <Link
                  href={ADMIN_MEDIA_EDIT(media._id)}
                  className="flex items-center gap-1"
                  onClick={handleEdit}
                >
                  <MdModeEditOutline /> Edit
                </Link>
              </DropdownMenuItem>
            )}

            {/* Copy Link */}
            <DropdownMenuItem className="flex items-center gap-1 cursor-pointer" onClick={handleCopyLink}>
              <MdLink /> Copy Link
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem className="flex items-center gap-1 cursor-pointer" onClick={handleDelete}>
              <MdDelete /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hover overlay */}
      <div className='absolute inset-0 z-10 transition-all duration-150 ease-in opacity-0 group-hover:opacity-30 bg-black' />

      {/* Image */}
      <div className="relative w-full h-full z-0">
        <Image
          src={imgSrc}
          alt={media?.alt || media?.title || "Media Image"}
          fill
          sizes="(max-width:768px) 50vw, 20vw"
          className="object-cover transition-opacity duration-300"
          onError={() => setImgSrc(transparentPixel)}
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default Media;