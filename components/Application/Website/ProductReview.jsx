'use client'

import axios from "@/lib/utils";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Rating } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import { showToast } from '@/lib/showToast'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

const ProductReview = ({ productId }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (rating < 1) return showToast("error", "Select rating");
    if (review.length < 3) return showToast("error", "Too short");

    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/review",
        {
          product: productId,
          rating,
          review,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        showToast("success", "Review added");
        setRating(0);
        setReview("");

        // ✅ REFRESH REACT QUERY DATA
        queryClient.invalidateQueries(['reviews', productId]);
      }

    } catch (err) {
      console.log(err);
      showToast("error", err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ================= */
  const fetchReviews = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(
      `/api/review?productId=${productId}&start=${pageParam}&size=5`
    )

    return {
      reviews: data.data,
      nextPage: data.data.length < 5 ? undefined : pageParam + 5,
      total: data.meta.totalRowCount,
    }
  }

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['reviews', productId],
    queryFn: fetchReviews,
    getNextPageParam: (last) => last.nextPage,
  })

  const reviews = data?.pages.flatMap(p => p.reviews) || []
  const totalReviews = data?.pages?.[0]?.total || 0

  return (
    <div className="p-5 border rounded">

      <Button onClick={() => setOpen(!open)}>
        {open ? "Close" : "Write Review"}
      </Button>

      {open && (
        <div className="mt-4 space-y-3">
          <Rating value={rating} onChange={(e, v) => setRating(v)} />

          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      )}

      <h3 className="mt-6 font-bold">
        {totalReviews} Reviews
      </h3>

      {reviews.map((r) => (
        <div key={r._id} className="border p-3 mt-3 rounded">
          <p className="font-semibold">
            {r.user?.name || "User"}
          </p>
          <Rating value={r.rating} readOnly />
          <p>{r.review}</p>
        </div>
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()}>
          Load More
        </Button>
      )}

    </div>
  )
}

export default ProductReview;