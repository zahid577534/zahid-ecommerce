import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ SAFETY CHECK
    if (!body || !Array.isArray(body.data)) {
      return response(false, 400, "Invalid cart data");
    }

    const verifiedCartData = await Promise.all(
      body.data.map(async (cartItem) => {
        const variant = await ProductVariantModel.findById(cartItem.variantId)
          .populate('product')
          .lean();

        if (!variant) return null;

        return {
          productId: variant.product._id,
          variantId: variant._id,
          name: variant.product.name,
          url: variant.product.slug,
          size: variant.size,
          color: variant.color,
          mrp: variant.mrp,
          sellingPrice: variant.finalPrice,
          media: variant.images?.[0]?.secure_url || null,
          quantity: cartItem.quantity,
        };
      })
    );

    return response(true, 200, "Verified Cart Data", verifiedCartData);

  } catch (error) {
    console.error("API Error:", error);
    return catchError(error);
  }
}