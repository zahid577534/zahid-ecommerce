import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";

import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import User from "@/models/Users.model";
import OrderModel from "@/models/Order.model";

import { response, catchError } from "@/lib/helperFunction";

export async function GET(req) {
  try {
    const auth = await isAuthenticated(req, "admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const totalCategories = await CategoryModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "user" });

    // ✅ FIXED: real orders count
    const totalOrders = await OrderModel.countDocuments();

    return response(
      true,
      200,
      "Dashboard counts fetched successfully",
      {
        categories: totalCategories,
        products: totalProducts,
        customers: totalCustomers,
        orders: totalOrders, // 🔥 FIXED
      }
    );
  } catch (error) {
    return catchError(error);
  }
}