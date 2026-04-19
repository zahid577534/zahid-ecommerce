"use client";

import React, { useEffect, useState } from 'react';
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import UploadMedia from '@/components/Application/Admin/UploadMedia';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminRoute';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Media from '@/components/Application/Admin/Media';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

// 1. Corrected Import
import useMediaMutation from '@/hooks/useMediaMutation';

const breadcrubData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Media' },
];

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState('SD');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const trashOf = searchParams?.get('trashof');
    setSelectedMedia([]);
    setDeleteType(trashOf ? 'PD' : 'SD');
  }, [searchParams]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: async ({ pageParam = 1 }) => {
      const { data: response } = await axios.get(
        `/api/media/delete?page=${pageParam}&limit=10&deleteType=${deleteType}`
      );
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.nextPage : undefined,
  });

  const allMediaIds = data?.pages?.flatMap((page) => page?.mediaData?.map((m) => m._id)) || [];

  // 2. Corrected hook call (must match the variable name used in handleAction)
 const mediaMutation = useMediaMutation(['media-data'], '/api/media/delete');

  const handleAction = (actionType) => {
    if (selectedMedia.length === 0) return;

    let confirmText = "";
    if (actionType === 'PD') confirmText = "Permanently delete these items?";
    if (actionType === 'SD') confirmText = "Move items to trash?";
    if (actionType === 'RESTORE') confirmText = "Restore items to library?";

    if (confirm(confirmText)) {
      mediaMutation.mutate({ 
        ids: selectedMedia, 
        deleteType: actionType 
      }, {
        onSuccess: () => setSelectedMedia([]) 
      });
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedMedia(checked ? allMediaIds : []);
  };

  const handleTrashClick = () => {
    router.push(deleteType === 'SD' ? `${ADMIN_MEDIA_SHOW}?trashof=media` : ADMIN_MEDIA_SHOW);
  };

  return (
    <div className="space-y-4">
       <BreadCrumb breadCrumbData={breadcrubData}  />
      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Checkbox.Root
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-blue-600"
                checked={selectedMedia.length === allMediaIds.length && allMediaIds.length > 0}
                onCheckedChange={handleSelectAll}
              >
                <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
              </Checkbox.Root>
              <h4 className="font-semibold text-xl uppercase">
                {deleteType === 'SD' ? 'Media' : 'Media Trash'}
              </h4>
            </div>

            <div className="flex items-center gap-4">
              {selectedMedia.length > 0 && (
                <div className="flex gap-2">
                  {deleteType === 'PD' && (
                    <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleAction('RESTORE')}>
                      Restore ({selectedMedia.length})
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleAction(deleteType)}>
                    {deleteType === 'PD' ? 'Delete Permanently' : 'Trash'} ({selectedMedia.length})
                  </Button>
                </div>
              )}
              {deleteType === 'SD' && <UploadMedia />}
              <Button variant={deleteType === 'SD' ? "secondary" : "default"} onClick={handleTrashClick}>
                {deleteType === 'SD' ? "View Trash" : "Back to Media"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {status === 'pending' ? <p>Loading...</p> : status === 'error' ? <p>{error.message}</p> : (
            <>
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4 mb-5">
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page?.mediaData?.map((media) => (
                      <Media
                        key={media._id}
                        media={media}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                        deleteType={deleteType}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {hasNextPage && (
                <Button variant="ghost" className="w-full" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
