'use client'

import React from "react"
import axios from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp"
import { IoStar } from "react-icons/io5"
import { useQuery } from "@tanstack/react-query"

const LatestReview = () => {

  /* ================= FETCH ================= */
  const fetchLatestReviews = async () => {
    const { data } = await axios.get(`/api/review?size=8`)
    return data.data
  }

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['latest-reviews'],
    queryFn: fetchLatestReviews,
  })

  return (
    <div className="h-[350px] overflow-y-auto border border-gray-200">

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[500px]">

          {/* HEADER */}
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {/* LOADING */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            )}

            {/* DATA */}
            {reviews.map((r) => (
              <TableRow key={r._id}>

                {/* PRODUCT */}
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[180px]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={imagePlaceholder.src} />
                    </Avatar>

                    <span className="truncate text-sm">
                      {r.product?.title || "Product"}
                    </span>
                  </div>
                </TableCell>

                {/* USER */}
                <TableCell>
                  <span className="text-sm">
                    {r.user?.name || "User"}
                  </span>
                </TableCell>

                {/* RATING */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IoStar
                        key={i}
                        className={`text-sm ${
                          i < r.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>

              </TableRow>
            ))}

            {/* EMPTY */}
            {!isLoading && reviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  No reviews found
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LatestReview