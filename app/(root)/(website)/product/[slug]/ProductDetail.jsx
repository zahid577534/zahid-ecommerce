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
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

import ButtonLoading from "@/components/Application/ButtonLoading";
import ProductReview from "@/components/Application/Website/ProductReview";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = ({
  product,
  variant,
  colors,
  sizes,
  reviewCount,
}) => {
  const dispatch = useDispatch();

  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // SET DEFAULT IMAGE
  useEffect(() => {
    if (variant?.images?.length > 0) {
      setActiveImage(variant.images[0].secure_url);
    } else {
      setActiveImage(null);
    }
  }, [variant]);

  const currentIndex = variant?.images?.findIndex(
    (img) => img.secure_url === activeImage
  );

  const handleNext = () => {
    if (!variant?.images?.length) return;
    const next = (currentIndex + 1) % variant.images.length;
    setActiveImage(variant.images[next].secure_url);
  };

  const handlePrev = () => {
    if (!variant?.images?.length) return;
    const prev =
      (currentIndex - 1 + variant.images.length) %
      variant.images.length;
    setActiveImage(variant.images[prev].secure_url);
  };

  // KEYBOARD SUPPORT
  useEffect(() => {
    const handleKey = (e) => {
      if (!isFullscreen) return;

      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKey);
    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, activeImage]);

  const handleAddToCart = () => {
    if (!product || !variant) return;

    dispatch(
      addToCart({
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        url: product.slug,
        size: variant.size,
        color: variant.color,
        mrp: variant.mrp,
        sellingPrice: variant.finalPrice,
        media: variant?.images?.[0]?.secure_url,
        quantity,
      })
    );

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
                {product?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* IMAGE SECTION */}
        <div className="w-full lg:w-1/2">

          <div className="border rounded-lg overflow-hidden bg-white">
            <img
              src={activeImage || imagePlaceholder.src}
              alt="product"
              onClick={() =>
                activeImage && setIsFullscreen(true)
              }
              className="w-full h-[400px] object-contain cursor-zoom-in"
            />
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto">
            {variant?.images?.map((img) => (
              <img
                key={img._id}
                src={img.secure_url}
                onClick={() =>
                  setActiveImage(img.secure_url)
                }
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  img.secure_url === activeImage
                    ? "border-black"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="w-full lg:w-1/2 space-y-4">

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
              ${variant?.finalPrice || 0}
            </p>
            <p className="line-through text-gray-500">
              ${variant?.mrp || 0}
            </p>
          </div>

          <p className="text-green-600">
            Discount: {variant?.discountPercentage || 0}%
          </p>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Description
            </h3>

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

          {/* QUANTITY */}
          <div>
            <p className="font-bold mb-2">Quantity</p>
            <div className="flex items-center border w-fit rounded">
              <button
                onClick={() =>
                  setQuantity((q) =>
                    q > 1 ? q - 1 : 1
                  )
                }
                className="w-10"
              >
                <HiMinus />
              </button>

              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, Number(e.target.value))
                  )
                }
                className="w-14 text-center"
              />

              <button
                onClick={() =>
                  setQuantity((q) => q + 1)
                }
                className="w-10"
              >
                <HiPlus />
              </button>
            </div>
          </div>

          <ButtonLoading
            text="Add to Cart"
            onClick={handleAddToCart}
            className="w-full py-3 rounded-full"
          />
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {isFullscreen && activeImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">

          <div className="flex justify-between items-center p-4 text-white">
            <span>
              {currentIndex + 1} / {variant?.images?.length}
            </span>

            <IoClose
              size={28}
              className="cursor-pointer"
              onClick={() => setIsFullscreen(false)}
            />
          </div>

          <div className="flex-1 flex items-center justify-center relative">

            <IoChevronBack
              size={40}
              className="absolute left-5 text-white cursor-pointer"
              onClick={handlePrev}
            />

            <img
              src={activeImage}
              className="max-h-[80vh] object-contain"
            />

            <IoChevronForward
              size={40}
              className="absolute right-5 text-white cursor-pointer"
              onClick={handleNext}
            />
          </div>

          <div className="flex gap-2 p-4 justify-center overflow-x-auto">
            {variant?.images?.map((img) => (
              <img
                key={img._id}
                src={img.secure_url}
                onClick={() =>
                  setActiveImage(img.secure_url)
                }
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  img.secure_url === activeImage
                    ? "border-white"
                    : "border-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <ProductReview productId={product?._id} />
    </div>
  );
};

export default ProductDetail;