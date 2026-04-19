import axios from "axios";
import ProductDetail from "./ProductDetail";


const ProductPage = async ({ params, searchParams }) => {
  // ✅ FIX params
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // ✅ FIX searchParams (IMPORTANT)
  const resolvedSearchParams = await searchParams;
  const { color, size } = resolvedSearchParams || {};

  console.log("Slug 👉", slug, "Size 👉", size, "Color 👉", color);

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  const query = new URLSearchParams();
  if (size) query.append("size", size);
  if (color) query.append("color", color);

  if ([...query].length > 0) {
    url += `?${query.toString()}`;
  }

  let data = null;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (res.ok) {
      const json = await res.json();
      data = json.data;
    } else {
      console.error("FETCH FAILED");
    }
  } catch (error) {
    console.error("FETCH ERROR 👉", error.message);
  }

  if (!data?.product) {
    return <h1 className="text-center mt-20">Product not found</h1>;
  }

  return (
    <ProductDetail
      product={data.product}
      variant={data.variant}
      variants={data.variants}
      colors={data.colors}
      sizes={data.sizes}
      reviews={data.reviews}
      selectedColor={color || null}
      selectedSize={size || null}
    />
  );
};

export default ProductPage;