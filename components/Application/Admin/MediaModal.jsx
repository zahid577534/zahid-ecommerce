'use client'

import React from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import loading from '@/public/assets/images/loading.svg'

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {

  const fetchMedia = async (pageParam = 0) => {
    const { data } = await axios.get(`/api/media?page=${pageParam}&limit=18&deleteType=SD`)
    return data
  }

  const {
    isPending,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['MediaModal'],
    queryFn: ({ pageParam }) => fetchMedia(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length
      return lastPage?.hasMore ? nextPage : undefined
    }
  })

  const handleMediaClick = (media) => {
    if (isMultiple) {
      const exists = selectedMedia?.find(item => item._id === media._id)
      if (exists) {
        setSelectedMedia(selectedMedia.filter(item => item._id !== media._id))
      } else {
        setSelectedMedia([...selectedMedia, media])
      }
    } else {
      setSelectedMedia([media])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[80%] h-[90vh] p-0 bg-transparent border-0 shadow-none"
      >
        <DialogDescription className="hidden" />

        <div className="h-full bg-white p-4 rounded-xl shadow-xl flex flex-col overflow-hidden">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle>Media Selection</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {isPending ? (
              <div className="size-full flex flex-col justify-center items-center gap-2">
                <Image src={loading} alt="loading" height={60} width={60} />
                <p className="text-sm text-gray-400">Loading library...</p>
              </div>
            ) : isError ? (
              <div className="size-full flex justify-center items-center">
                <span className="text-red-500 font-medium">{error.message}</span>
              </div>
            ) : (
              <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-3">
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media) => {
                      const isSelected = selectedMedia?.some(item => item._id === media._id);
                      
                      // Fallback logic: check for .url or .secure_url (common in Cloudinary)
                      const imageUrl = media.url || media.secure_url;

                      return (
                        <div
                          key={media._id}
                          onClick={() => handleMediaClick(media)}
                          // IMPORTANT: "relative" is required for Next.js "fill" to work
                          className={`relative cursor-pointer border-2 rounded-lg overflow-hidden h-32 transition-all ${
                            isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt="media"
                              fill
                              sizes="(max-width: 768px) 50vw, 15vw"
                              className="object-cover"
                              // Use unoptimized if images still don't show after config update
                              unoptimized={false} 
                            />
                          ) : (
                            <div className="size-full flex flex-col items-center justify-center bg-gray-50 text-[10px] text-gray-400 italic">
                              No Preview
                            </div>
                          )}
                          
                          {isSelected && (
                            <div className="absolute top-1 right-1 z-10 bg-blue-600 text-white rounded-full p-1">
                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMedia([])}>
              Clear Selected ({selectedMedia?.length || 0})
            </Button>

            <div className="flex gap-2">
              {hasNextPage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MediaModal
