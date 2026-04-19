'use client'

import React, { useMemo, useState } from 'react'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { IconButton, Tooltip } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { showToast } from '@/lib/showToast'
import { useQueryClient } from '@tanstack/react-query'
import { ADMIN_DASHBOARD } from '@/routes/AdminRoute'
import { DT_REVIEW_COLUMN } from '@/lib/column'

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Reviews' },
]

const ShowReviews = () => {
  const queryClient = useQueryClient()
  const [exportLoading, setExportLoading] = useState(false)

  // ✅ optional filter
  const [productId, setProductId] = useState('')

  const columns = useMemo(() => DT_REVIEW_COLUMN, [])

  // ---------------- DELETE ----------------
  const handlePermanentDelete = async (ids) => {
  try {
    const res = await fetch("/api/review", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    showToast("success", data.message);
  } catch (err) {
    showToast("error", err.message);
  }
};

  // ---------------- EXPORT ----------------
  const handleExport = async () => {
    setExportLoading(true)

    try {
      const url = productId
        ? `/api/review?productId=${productId}&export=true`
        : `/api/review?export=true`

      const res = await fetch(url)
      const blob = await res.blob()

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'reviews.csv'
      link.click()
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setExportLoading(false)
    }
  }

  // ---------------- ACTION ----------------
  const createAction = (row) => {
    const id = row?.original?._id

    return (
      <Tooltip title="Delete">
        <IconButton
          onClick={() => {
            if (confirm('Delete this review?')) {
              handlePermanentDelete([id])
            }
          }}
        >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter by Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FileDownloadIcon />
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* TABLE */}
      <DatatableWrapper
        fetchUrl={
          productId
            ? `/api/review?productId=${productId}`
            : `/api/review`
        }
        queryKey={['reviews-data', productId]}
        columnsConfig={columns}
        createAction={createAction}
      />
    </>
  )
}

export default ShowReviews