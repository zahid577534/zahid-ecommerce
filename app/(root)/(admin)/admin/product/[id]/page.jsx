'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD } from "@/routes/AdminRoute";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: "/admin/product", label: "Products" },
    { href: "", label: "View Product" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product?id=${id}`);
        if (res.data.success) setProduct(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      {/* Main Card */}
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="bg-gray-50 p-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Slug: {product.slug}</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          {/* Category and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p><strong>Category:</strong> {product.category?.name || "-"}</p>
              <p><strong>MRP:</strong> ₹{product.mrp.toFixed(2)}</p>
              <p><strong>Selling Price:</strong> ₹{product.sellingPrice.toFixed(2)}</p>
              <p><strong>Discount:</strong> {product.discountPercentage}%</p>
            </div>

            {/* Images */}
            <div>
              <p className="font-medium mb-2">Product Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images?.map(img => (
                  <div key={img._id} className="w-150 h-100 relative rounded overflow-hidden border border-gray-200 shadow-sm">
                    <Image 
                      src={img.url || img.secure_url} 
                      alt={product.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ))}
                {(!product.images || product.images.length === 0) && (
                  <p className="text-gray-400">No images available</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="font-medium">Description:</p>
            <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProductView;