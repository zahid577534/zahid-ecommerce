'use client'

import React, { useMemo, useCallback } from "react";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePlus } from "lucide-react";

import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import { columnConfig } from "@/lib/helperFunction";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminRoute";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Show Category" },
];

const ShowCategory = () => {
  const columns = useMemo(() => columnConfig(DT_CATEGORY_COLUMN), []);

  // Optional: Row-level action (permanent delete)
  const action = useCallback((row, handleDelete) => {
    return [
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
      />,
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2 flex justify-between items-center">
          <h4 className="text-xl font-semibold">Show Category</h4>

          <Button asChild>
            <Link href={ADMIN_CATEGORY_ADD} className="flex items-center">
              <FilePlus className="mr-2" />
              New Category
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <DatatableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category" // PUT endpoint handles permanent delete
            createAction={action}          // Optional row-level actions
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategory;