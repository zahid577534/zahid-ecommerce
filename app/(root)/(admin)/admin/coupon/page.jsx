'use client';

import React, { useMemo, useState } from "react";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { showToast } from "@/lib/showToast";
import { useQueryClient } from "@tanstack/react-query";

import { ADMIN_DASHBOARD } from "@/routes/AdminRoute";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Coupons" },
];

const ShowCoupon = () => {
  const queryClient = useQueryClient();
  const [exportLoading, setExportLoading] = useState(false);

  // ✅ Columns
  const columns = useMemo(() => [
    { accessorKey: "code", header: "Coupon Code" },
    { accessorKey: "discountPercentage", header: "Discount %" },
    {
      accessorKey: "validity",
      header: "Validity Date",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleDateString() : "-";
      },
    },
  ], []);

  // ✅ DELETE FUNCTION (SAFE)
  const handlePermanentDelete = async (ids) => {
    if (!ids || ids.length === 0) {
      showToast("error", "No ID provided");
      return;
    }

    try {
      const res = await fetch("/api/coupon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      showToast("success", data.message || "Deleted successfully");

      // ✅ Refresh table
      queryClient.invalidateQueries(["coupon-data"]);

    } catch (error) {
      console.error(error);
      showToast("error", error.message);
    }
  };

  // ✅ EXPORT CSV
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await fetch("/api/coupon");
      const json = await res.json();

      if (!json.success) throw new Error(json.message);

      const csvRows = [
        ["Code", "Discount %", "Validity"],
        ...json.data.map(c => [
          c.code,
          c.discountPercentage,
          new Date(c.validity).toLocaleDateString()
        ])
      ];

      const csvContent = csvRows.map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "coupons.csv";
      a.click();

    } catch (error) {
      showToast("error", error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // ✅ ACTION BUTTON (SAFE ID CHECK + CONFIRMATION)
  const createAction = (row) => {
    const id = row?.original?._id;

    // 🔴 Prevent undefined error
    if (!id) {
      console.error("Missing ID:", row.original);
      return null;
    }

    return [
      <Tooltip key={`delete-${id}`} title="Delete Permanently">
        <IconButton
          onClick={() => {
            if (confirm("Are you sure you want to delete this coupon?")) {
              handlePermanentDelete([id]);
            }
          }}
          size="small"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      </Tooltip>,
    ];
  };

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {/* ✅ EXPORT BUTTON */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={exportLoading}
        >
          <FileDownloadIcon />
          {exportLoading ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* ✅ TABLE */}
      <DatatableWrapper
        fetchUrl="/api/coupon"
        queryKey="coupon-data"
        columnsConfig={columns}
        createAction={createAction}
      />
    </>
  );
};

export default ShowCoupon;