'use client'

import React, { useMemo, useCallback } from "react"
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import Datatable from "@/components/Application/Admin/Datatable"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton, Tooltip } from "@mui/material"
import { ADMIN_DASHBOARD } from "@/routes/AdminRoute"

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Trash" }
]

const TrashProductVariant = () => {

  const columns = useMemo(() => [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "size", header: "Size" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "mrp", header: "MRP" },
    { accessorKey: "sellingPrice", header: "Selling Price" },
    { accessorKey: "discountPercentage", header: "Discount %" },
  ], [])

  const createAction = useCallback((row, handleDelete) => {
    const ids = [row.original._id]
    return (
      <Tooltip title="Delete Permanently">
        <IconButton size="small" onClick={async () => await handleDelete(ids, "PD")}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )
  }, [])

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Datatable
        queryKey="product-variant-trash"
        fetchUrl="/api/product-variant?trash=true"
        columnsConfig={columns}
        initialPageSize={10}

        exportEndpoint="/api/product-variant/export"
        deleteEndpoint="/api/product-variant/delete"  // ✅ corrected
        deleteType="PD"                         // permanent delete
        trashView={true}

        createAction={createAction}
      />
    </>
  )
}

export default TrashProductVariant