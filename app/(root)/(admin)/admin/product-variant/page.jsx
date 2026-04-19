'use client'

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { showToast } from "@/lib/showToast";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_EDIT } from "@/routes/AdminRoute";
import { useQueryClient } from "@tanstack/react-query";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Product Variants" },
];

const ShowProductVariant = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ---------------- Table Columns ----------------
  const columns = useMemo(() => [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "size", header: "Size" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "mrp", header: "MRP" },
    { accessorKey: "sellingPrice", header: "Selling Price" },
    { accessorKey: "discountPercentage", header: "Discount %" },
  ], []);

  // ---------------- Handle Permanent Delete ----------------
 const handlePermanentDelete = async (ids) => {
  if (!ids || ids.length === 0) return;
  try {
    const res = await fetch("/api/product-variant", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    // ✅ Refresh table
    queryClient.invalidateQueries(["product-variant-data"]);
  } catch (error) {
    showToast("error", error.message);
  }
};
  // ---------------- Row Actions ----------------
  const createAction = (row) => {
    const id = row.original._id;
    return [
      <Tooltip key={`view-${id}`} title="View">
        <IconButton onClick={() => router.push(`/admin/product-variant/${id}`)} size="small">
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>,

      <Tooltip key={`edit-${id}`} title="Edit">
        <IconButton onClick={() => router.push(`${ADMIN_PRODUCT_VARIANT_EDIT}/${id}`)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>,

      <Tooltip key={`delete-${id}`} title="Delete Permanently">
        <IconButton onClick={() => handlePermanentDelete([id])} size="small">
          🗑️
        </IconButton>
      </Tooltip>,
    ];
  };

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <DatatableWrapper
        fetchUrl="/api/product-variant"
      //  deleteEndpoint="/api/product-variant"  // DELETE endpoint
        queryKey="product-variant-data"
        columnsConfig={columns}
        exportEndpoint="/api/product-variant/export"
                          // no recycle bin
        createAction={createAction}            // row-level actions  
        deleteEndpoint="/api/product-variant/delete"
         
      />
    </>
  );
};

export default ShowProductVariant;