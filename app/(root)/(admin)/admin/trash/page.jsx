'use client'

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Datatable from "@/components/Application/Admin/Datatable";

import { columnConfig } from "@/lib/helperFunction";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import { DT_PRODUCT_COLUMN } from "@/lib/columns";
import { ADMIN_CATEGORY_SHOW, ADMIN_TRASH, ADMIN_PRODUCT_SHOW } from "@/routes/AdminRoute";

// Keep this OUTSIDE to prevent the infinite render loop
const TRASH_CONFIGS = {
  category: {
    fetchUrl: "/api/category?trash=true",
    queryKey: "category-trash",
    columnsConfig: DT_CATEGORY_COLUMN,
    label: "Category Trash",
    backHref: ADMIN_CATEGORY_SHOW,
    backLabel: "Back to Categories",
    deleteEndpoint: "/api/category",
    exportEndpoint: "/api/category/export",
  },
  product: {
    fetchUrl: "/api/product?trash=true",
    queryKey: "product-trash",
    columnsConfig: DT_PRODUCT_COLUMN,
    label: "Product Trash",
    backHref: ADMIN_PRODUCT_SHOW,
    backLabel: "Back to Products",
    deleteEndpoint: "/api/product",
    exportEndpoint: "/api/product/export",
  },
};

const TrashPage = () => {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof") || "category"; 

  // Select config based on URL param
  const config = TRASH_CONFIGS[trashOf] || TRASH_CONFIGS.category;

  // Memoize columns specifically based on the source config
  const columns = useMemo(() => {
    return columnConfig(config.columnsConfig);
  }, [config.columnsConfig]);

  const breadCrumbData = [
    { href: config.backHref, label: "Home" },
    { href: ADMIN_TRASH(trashOf), label: config.label },
  ];

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config.label}</h4>
            <Button asChild variant="outline">
              <Link href={config.backHref} className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                {config.backLabel}
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* THE KEY PROP IS CRITICAL: It forces Datatable to reload when trashOf changes */}
          <Datatable
            key={trashOf} 
            queryKey={config.queryKey}
            fetchUrl={config.fetchUrl}
            columnsConfig={columns}
            initialPageSize={10}
            deleteEndpoint={config.deleteEndpoint}
            exportEndpoint={config.exportEndpoint}
            trashView={true}
            trashOf={trashOf}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrashPage;
