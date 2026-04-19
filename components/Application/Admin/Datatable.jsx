'use client'

import React, { useState } from "react";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";

import { IconButton, Tooltip } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import ButtonLoading from "../ButtonLoading";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
}) => {
  const queryClient = useQueryClient();
  const finalDeleteEndpoint = deleteEndpoint || fetchUrl;

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  /* ================= FETCH ================= */
  const { data: { data = [], meta } = {}, isError, isRefetching, isLoading } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set("start", `${pagination.pageIndex * pagination.pageSize}`);
      url.searchParams.set("size", `${pagination.pageSize}`);
      const { data: response } = await axios.get(url.href);
      return response;
    },
    keepPreviousData: true,
  });

  /* ================= DELETE ================= */
const permanentDeleteMutation = useMutation({
  mutationFn: async (ids) => {
    if (!ids || ids.length === 0) throw new Error("No IDs provided");

    // Customers
    if (finalDeleteEndpoint.includes("/api/customers")) {
      return axios.delete(finalDeleteEndpoint, { data: { ids } });
    }

    // Coupons
    if (finalDeleteEndpoint.includes("/api/coupon")) {
      return axios.delete(finalDeleteEndpoint, { data: { ids } });
    }

    // Products & Categories (IMPORTANT)
    if (
      finalDeleteEndpoint.includes("/api/product") ||
      finalDeleteEndpoint.includes("/api/category")
    ) {
      return axios.put(finalDeleteEndpoint, {
        ids,
        deleteType: "PD", // keep your existing backend logic
      });
    }

    // Reviews (DELETE)
    if (finalDeleteEndpoint.includes("/api/review")) {
      return axios.delete(finalDeleteEndpoint, {
        data: { ids },
      });
    }

    // Default fallback
    return axios.delete(finalDeleteEndpoint, {
      data: { ids },
    });
  },

  onSuccess: () => {
    queryClient.invalidateQueries([queryKey]);
    showToast("success", "Deleted successfully");
  },

  onError: (error) => {
    showToast("error", error.message || "Delete failed");
  },
});
  /* ================= EXPORT ================= */
  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "export",
      });

      let csv;

      if (Object.keys(rowSelection).length > 0 && selectedRows?.length > 0) {
        const rowData = selectedRows.map((row) => row.original);
        csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      } else if (exportEndpoint) {
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) throw new Error(response.message);
        csv = generateCsv(csvConfig)(response.data);
        download(csvConfig)(csv);
      } else {
        csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setExportLoading(false);
    }
  };

  /* ================= 🔥 AUTO FIX OBJECT RENDER ================= */
  const safeColumns = (columnsConfig || []).map((col) => {
    // If already using accessorFn, keep it
    if (col.accessorFn) return col;

    return {
      ...col,
      Cell: ({ cell }) => {
        const value = cell.getValue();

        // ✅ Handle object safely
        if (value && typeof value === "object") {
          return (
            value?.name ||
            value?.title ||
            value?._id ||
            "N/A"
          );
        }

        return value ?? "N/A";
      },
    };
  });

  /* ================= TABLE ================= */
  const table = useMaterialReactTable({
    columns: safeColumns,
    data: data ?? [],
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
      rowSelection,
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: isError,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row._id,

    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex space-x-2 items-center">
        <ButtonLoading
          type="button"
          text={<><FileDownloadIcon /> Export</>}
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        />

        <Tooltip title="Permanently Delete Selected">
          <IconButton
            onClick={() => {
              const ids = Object.keys(rowSelection);
              if (!ids.length) return showToast("error", "No rows selected");
              permanentDeleteMutation.mutate(ids);
              table.resetRowSelection();
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>

        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleGlobalFilterButton table={table} />
      </div>
    ),

    renderRowActions: ({ row }) => {
      const id = row.original?._id;
      if (!id) return null;

      return (
        <Tooltip title="Permanently Delete">
          <IconButton onClick={() => permanentDeleteMutation.mutate([id])}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Datatable;