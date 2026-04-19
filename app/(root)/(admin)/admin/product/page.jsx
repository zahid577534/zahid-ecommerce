'use client'

import React, { useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"

import { IconButton, Tooltip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"

import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_EDIT
} from "@/routes/AdminRoute"

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Products" }
]

const ShowProduct = () => {
  const router = useRouter()

  const columns = useMemo(() => [
    {
      accessorKey: "images",
      header: "Image",
      size: 80,
      Cell: ({ cell }) => {
        const images = cell.getValue()

        let url = ""

        if (Array.isArray(images) && images.length > 0) {
          const first = images[0]

          if (typeof first === "string") {
            url = first
          } else if (first?.url) {
            url = first.url
          } else if (first?.secure_url) {
            url = first.secure_url
          }
        }

        if (!url) return "N/A"

        return (
          <Image
            src={url}
            alt="product"
            width={40}
            height={40}
            className="rounded object-cover"
          />
        )
      },
    },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "category.name", header: "Category" },
    { accessorKey: "mrp", header: "MRP" },
    { accessorKey: "sellingPrice", header: "Selling Price" },
    { accessorKey: "discountPercentage", header: "Discount %" },
  ], [])

  const createAction = (row) => {
    const product = row.original

    return [
      <Tooltip key={product._id} title="View">
        <IconButton onClick={() => router.push(`/admin/product/${product._id}`)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ]
  }

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <DatatableWrapper
        queryKey="product-data"
        fetchUrl="/api/product"
        columnsConfig={columns}
        initialPageSize={10}
        exportEndpoint="/api/product/export"
        deleteEndpoint="/api/product"
        createAction={createAction}
      />
    </>
  )
}

export default ShowProduct