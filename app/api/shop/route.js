import { catchError } from "@/lib/errorHandler";
import { connectDB } from "@/lib/databaseConnection";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import { response } from "@/lib/helperFunction";

export async function GET(req) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    // =========================
    // QUERY PARAMS
    // =========================
    const categorySlug = searchParams.get("category");
    const size = searchParams.get("size");
    const colors = searchParams.get("color");
    const price = searchParams.get("price");
    const search = searchParams.get("search");

    const limit = parseInt(searchParams.get("limit")) || 9;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const sortOption = searchParams.get("sort") || "default";

    // =========================
    // SORT
    // =========================
    let sortQuery = { createdAt: -1 };

    if (sortOption === "price_high_low") {
      sortQuery = { minPrice: -1 };
    } else if (sortOption === "price_low_high") {
      sortQuery = { minPrice: 1 };
    }

    // =========================
    // FILTER PARSE
    // =========================
    const sizeArray = size
      ? size.split(",").map((s) => s.toUpperCase())
      : [];

    const colorArray = colors ? colors.split(",") : [];

    let minPrice = null;
    let maxPrice = null;

    if (price) {
      const [min, max] = price.split("-");
      minPrice = Number(min);
      maxPrice = Number(max);
    }

    // =========================
    // CATEGORY → IDs
    // =========================
    let categoryIds = [];

    if (categorySlug) {
      const slugs = categorySlug.split(",");

      const categories = await CategoryModel.find({
        slug: { $in: slugs },
      }).select("_id");

      categoryIds = categories.map((c) => c._id);
    }

    // =========================
    // MATCH STAGE
    // =========================
    let matchStage = {};

    if (categoryIds.length) {
      matchStage.category = { $in: categoryIds };
    }

    if (search) {
      matchStage.name = {
        $regex: search,
        $options: "i",
      };
    }

    // =========================
    // PIPELINE
    // =========================
    let products = await ProductModel.aggregate([
      { $match: matchStage },

      // 🔥 GET VARIANTS
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

      // 🔥 FILTER VARIANTS
      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  ...(sizeArray.length
                    ? [{ $in: ["$$variant.size", sizeArray] }]
                    : []),

                  ...(colorArray.length
                    ? [{ $in: ["$$variant.color.name", colorArray] }]
                    : []),

                  ...(minPrice !== null
                    ? [{ $gte: ["$$variant.sellingPrice", minPrice] }]
                    : []),

                  ...(maxPrice !== null
                    ? [{ $lte: ["$$variant.sellingPrice", maxPrice] }]
                    : []),
                ],
              },
            },
          },
        },
      },

      // 🔥 REMOVE EMPTY PRODUCTS
      {
        $match: {
          "variants.0": { $exists: true },
        },
      },

      // 🔥 MIN PRICE
      {
        $addFields: {
          minPrice: { $min: "$variants.sellingPrice" },
        },
      },

      // 🔥 SORT
      { $sort: sortQuery },

      // 🔥 PAGINATION
      { $skip: skip },
      { $limit: limit + 1 },

      // 🔥 GET IMAGES
      {
        $lookup: {
          from: "medias",
          localField: "images",
          foreignField: "_id",
          as: "images",
        },
      },

      // 🔥 FINAL SHAPE
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          minPrice: 1,

          images: {
            $map: {
              input: "$images",
              as: "img",
              in: {
                _id: "$$img._id",
                secure_url: "$$img.secure_url",
                thumbnail_url: "$$img.thumbnail_url",
                alt: "$$img.alt",
              },
            },
          },

          variants: {
            $map: {
              input: "$variants",
              as: "v",
              in: {
                _id: "$$v._id",
                size: "$$v.size",
                stock: "$$v.stock",
                sellingPrice: "$$v.sellingPrice",
                mrp: "$$v.mrp",
                discountPercentage: "$$v.discountPercentage",
                finalPrice: "$$v.finalPrice",
                color: "$$v.color",
              },
            },
          },
        },
      },
    ]);

    // =========================
    // NEXT PAGE
    // =========================
    let nextPage = null;

    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    // =========================
    // RESPONSE
    // =========================
    return response(true, 200, "Products fetched successfully", {
      products,
      nextPage,
    });

  } catch (error) {
    return catchError(error);
  }
}