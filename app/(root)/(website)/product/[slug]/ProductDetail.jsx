"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { useEffect, useState } from "react";
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import { IoStar } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";

import ButtonLoading from "@/components/Application/ButtonLoading";
import ProductReview from "@/components/Application/Website/ProductReview";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice"; // ✅ FIXED PATH
import { toast } from "react-toastify";

const ProductDetail = ({ product, variant, colors, sizes, reviewCount }) => {
  const dispatch = useDispatch();

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // SET DEFAULT IMAGE
  useEffect(() => {
    if (variant?.images?.length > 0) {
      setActiveImage(variant.images[0].secure_url);
    }
  }, [variant]);

  // ADD TO CART FUNCTION
  const handleAddToCart = () => {
    if (!product || !variant) return;

    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.finalPrice,
      media: variant?.images?.[0]?.secure_url,
      quantity: quantity,
    };

    dispatch(addToCart(cartProduct));

    toast.success("Added to cart ✅");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-32 py-6 sm:py-10">

      {/* BREADCRUMB */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={WEBSITE_SHOP}>Product</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                {product?.name || "Product"}
              </BreadcrumbPage>
            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* IMAGE */}
        <div className="w-full lg:w-1/2">

          <img
            src={activeImage || imagePlaceholder.src}
            alt={product?.name}
            className="w-full h-[250px] sm:h-[350px] lg:h-[450px] object-cover rounded-lg mb-4"
          />

          {/* THUMBNAILS */}
          <div className="flex gap-2 overflow-x-auto">
            {variant?.images?.map((thumb) => (
              <img
                key={thumb._id}
                src={thumb.secure_url}
                alt="thumb"
                className={`w-14 h-14 object-cover rounded cursor-pointer border-2 ${
                  thumb.secure_url === activeImage
                    ? "border-black"
                    : "border-transparent"
                }`}
                onClick={() => setActiveImage(thumb.secure_url)}
              />
            ))}
          </div>

        </div>

        {/* DETAILS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">

          <h1 className="text-2xl font-semibold">
            {product?.name}
          </h1>

          {/* STARS */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} />
            ))}
            <span className="ml-2 text-sm">
              {reviewCount || 0} Reviews
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 text-xl">
            <p className="font-bold text-red-600">
              Rs {variant?.finalPrice || 0}
            </p>
            <p className="line-through text-gray-500">
              Rs {variant?.mrp || 0}
            </p>
          </div>

          <p className="text-green-600">
            Discount: {variant?.discountPercentage || 0}%
          </p>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold">Description</h3>

            {product?.description ? (
              <div
                className="text-gray-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            ) : (
              <p className="text-gray-500 text-sm">
                No description available.
              </p>
            )}
          </div>

          {/* COLORS */}
          <div>
            <p className="font-semibold">
              Color: {variant?.color?.name || "N/A"}
            </p>

            <div className="flex gap-2 flex-wrap">
              {colors?.map((color) => {
                const isActive =
                  color.name === variant?.color?.name;

                return (
                  <Link
                    key={color.name}
                    href={`?color=${encodeURIComponent(
                      color.name
                    )}&size=${encodeURIComponent(
                      variant?.size || ""
                    )}`}
                    className={`border px-3 py-1 rounded ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`}
                  >
                    {color.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <p className="font-semibold">
              Size: {variant?.size || "N/A"}
            </p>

            <div className="flex gap-2 flex-wrap">
              {sizes?.map((size) => {
                const isActive = size === variant?.size;

                return (
                  <Link
                    key={size}
                    href={`?color=${encodeURIComponent(
                      variant?.color?.name || ""
                    )}&size=${encodeURIComponent(size)}`}
                    className={`border px-3 py-1 rounded ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`}
                  >
                    {size}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <p className="font-bold mb-2">Quantity</p>

            <div className="flex items-center border w-fit rounded overflow-hidden">

              <button
                onClick={() =>
                  setQuantity((q) => (q > 1 ? q - 1 : 1))
                }
                className="w-10 flex justify-center"
              >
                <HiMinus />
              </button>

              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                className="w-14 text-center outline-none"
              />

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 flex justify-center"
              >
                <HiPlus />
              </button>

            </div>
          </div>

          {/* ADD TO CART */}
          <ButtonLoading
            type="button"
            text="Add to Cart"
            className="w-full rounded-full py-4 cursor-pointer"
            onClick={handleAddToCart}
          />

        </div>
      </div>

      {/* REVIEW */}
      <ProductReview productId={product?._id} />

    </div>
  );
};

export default ProductDetail;