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
    const color = searchParams.get("color");
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
    // FILTER PARSING
    // =========================
    const sizeArray = size
      ? size.split(",").map((s) => s.toUpperCase())
      : [];

    const colorArray = color
      ? color.split(",").map((c) => c.trim())
      : [];

    let minPrice = null;
    let maxPrice = null;

    if (price) {
      const [min, max] = price.split("-");
      minPrice = Number(min);
      maxPrice = Number(max);
    }

    // =========================
    // CATEGORY IDS
    // =========================
    let categoryIds = [];

    if (categorySlug) {
      const slugs = categorySlug.split(",");

      const categoriesFromDB = await CategoryModel.find({
        slug: { $in: slugs },
      }).select("_id");

      categoryIds = categoriesFromDB.map((c) => c._id);
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
    // PRODUCTS PIPELINE
    // =========================
    let products = await ProductModel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

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
                    ? [
                        {
                          $in: [
                            "$$variant.color.name",
                            colorArray,
                          ],
                        },
                      ]
                    : []),

                  ...(minPrice !== null
                    ? [
                        {
                          $gte: [
                            "$$variant.sellingPrice",
                            minPrice,
                          ],
                        },
                      ]
                    : []),

                  ...(maxPrice !== null
                    ? [
                        {
                          $lte: [
                            "$$variant.sellingPrice",
                            maxPrice,
                          ],
                        },
                      ]
                    : []),
                ],
              },
            },
          },
        },
      },

      {
        $match: {
          "variants.0": { $exists: true },
        },
      },

      {
        $addFields: {
          minPrice: {
            $min: "$variants.sellingPrice",
          },
        },
      },

      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit + 1 },

      {
        $lookup: {
          from: "medias",
          localField: "images",
          foreignField: "_id",
          as: "images",
        },
      },

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
                discountPercentage:
                  "$$v.discountPercentage",
                finalPrice: "$$v.finalPrice",
                color: {
                  name: {
                    $ifNull: ["$$v.color.name", null],
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // =========================
    // PAGINATION
    // =========================
    let nextPage = null;

    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    // =========================
    // CATEGORIES
    // =========================
    const categories = await CategoryModel.find({})
      .select("name slug")
      .lean();

    // =========================
    // COLORS (FIXED - NO DUPLICATE, NO CRASH)
    // =========================
    const colorAgg = await ProductModel.aggregate([
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

      { $unwind: "$variants" },

      {
        $project: {
          colorName: {
            $ifNull: ["$variants.color.name", null],
          },
        },
      },

      {
        $match: {
          colorName: { $ne: null },
        },
      },

      {
        $group: {
          _id: "$colorName",
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
        },
      },
    ]);

    // ✅ FINAL CLEAN COLORS (ONLY ONCE)
    const colors = colorAgg;

    // =========================
    // SAFE RESPONSE
    // =========================
    return Response.json(
      {
        success: true,
        message: "Products fetched successfully",
        data: {
          products,
          nextPage,
          categories,
          colors,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("SHOP API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}