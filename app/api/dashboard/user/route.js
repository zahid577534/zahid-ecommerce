import OrderModel from "@/models/Order.model";
import UserModel from "@/models/Users.model";
import { isAuthenticated } from "@/lib/authentication";
import { response } from "@/lib/helperFunction";

export async function GET(req) {
  try {
    const auth = await isAuthenticated(req, "user");

    if (!auth?.isAuth || !auth?.user?._id) {
      return response(false, 401, "Unauthorized");
    }

    const user = await UserModel.findById(auth.user._id);

    if (!user) {
      return response(false, 404, "User not found");
    }

    // ✅ FIXED: match by userId instead of phone
    const recentOrders = await OrderModel.find({
      "customer.userId": user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const totalOrders = await OrderModel.countDocuments({
      "customer.userId": user._id,
    });
console.log("COOKIE:", req.cookies.get("access_token"));
    return response(true, 200, "Dashboard Data", {
      recentOrders,
      totalOrders,
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return response(false, 500, error.message);
  }
}