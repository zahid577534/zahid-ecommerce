import { jwtVerify } from "jose";

export const isAuthenticated = async (req, role) => {
  try {
    // ✅ ALWAYS read from request (safe + correct)
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return { isAuth: false, user: null };
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const { payload } = await jwtVerify(token, secret);

    if (role && payload.role !== role) {
      return { isAuth: false, user: null };
    }

    return {
      isAuth: true,
      user: {
        _id: payload._id,
        role: payload.role,
      },
    };
  } catch (error) {
    return { isAuth: false, user: null };
  }
};