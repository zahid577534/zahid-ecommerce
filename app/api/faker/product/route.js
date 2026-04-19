import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.model";

import { response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/databaseConnection";

// Helper function
function getRandomItems(array, count = 1) {
   const shuffled = [...array].sort(() => 0.5 - Math.random());
   return shuffled.slice(0, count);
}

export async function POST(req) {
   await connectDB();

   try {
      // ✅ Fetch categories
      const categories = await CategoryModel.find();
      if (categories.length === 0) {
         return response(false, 400, "No categories found!");
      }

      // ✅ Fetch media
      const mediaList = await MediaModel.find();
      const mediaMap = mediaList.map(media => media._id);

      // ✅ FIXED COLORS (object with name + hex)
      const colors = [
         { name: "Red", hex: "#FF0000" },
         { name: "Blue", hex: "#0000FF" },
         { name: "Green", hex: "#008000" },
         { name: "Black", hex: "#000000" }
      ];

      const sizes = ["S", "M", "L", "XL", "2XL"];

      let products = [];
      let variants = [];

      for (const category of categories) {

         for (let i = 0; i < 5; i++) {

            const mrp = Number(faker.commerce.price(500, 2000, 0));
            const discountPercentage = faker.number.int({ min: 10, max: 50 });
            const sellingPrice = Math.round(
               mrp - (mrp * discountPercentage) / 100
            );

            const productId = new mongoose.Types.ObjectId();
            const selectedMedia = getRandomItems(mediaMap, 4);

            // ✅ PRODUCT
            const product = {
               _id: productId,
               name: faker.commerce.productName(),
               slug: faker.lorem.slug(),
               category: category._id,
               mrp,
               sellingPrice,
               discountPercentage,
               media: selectedMedia,
               description: faker.commerce.productDescription(),
               deletedAt: null,
               createdAt: new Date(),
               updatedAt: new Date(),
            };

            products.push(product);

            // ✅ VARIANTS (4 colors × 5 sizes = 20 variants)
            for (const color of colors) {
               for (const size of sizes) {

                  const variantMedia = getRandomItems(mediaMap, 4);

                  variants.push({
                     _id: new mongoose.Types.ObjectId(),
                     product: productId,

                     // ✅ FIXED COLOR STRUCTURE
                     color: {
                        name: color.name,
                        hex: color.hex
                     },

                     size,
                     mrp,
                     sellingPrice,
                     discountPercentage,

                     // ✅ REQUIRED FIELD FIX
                     finalPrice: sellingPrice,

                     sku: `${product.slug}-${color.name}-${size}-${faker.number.int({
                        min: 1000,
                        max: 9999
                     })}`,

                     stock: faker.number.int({ min: 10, max: 100 }),
                     media: variantMedia,
                     deletedAt: null,
                     createdAt: new Date(),
                     updatedAt: new Date(),
                  });
               }
            }
         }
      }

      // ✅ Insert into DB
      await ProductModel.insertMany(products);
      await ProductVariantModel.insertMany(variants);

      return response(true, 200, "Fake data generated successfully.");

   } catch (error) {
      console.error(error);
      return response(false, 500, error.message);
   }
}