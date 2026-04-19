import { z } from "zod";

/**
 * Helper for numeric fields (accepts number or string)
 */
const numericField = (label) =>
  z.union([
    z.number().nonnegative(`${label} must be a positive value`),
    z
      .string()
      .transform((val) => Number(val))
      .refine(
        (val) => !isNaN(val) && val >= 0,
        `Please enter a valid ${label}`
      ),
  ]);

/* -------------------------------
   AUTH SCHEMA
-------------------------------- */
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[a-z]/, "One lowercase letter required")
    .regex(/[0-9]/, "One number required")
    .regex(/[@$!%*?&]/, "One special character required"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "Numbers only"),

  name: z
    .string()
    .trim()
    .min(2, "Name too short")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
});

/* -------------------------------
   PRODUCT SCHEMA
-------------------------------- */
export const productSchema = z.object({
  _id: z.string().optional(),

  alt: z.string().min(3).optional(),

  title: z.string().min(3, "Title is required"),

  slug: z.string().min(3).optional(),

  category: z.string().min(3).optional(),

  description: z.string().min(3).optional(),

  media: z.array(z.string()).optional(),

  product: z.string().min(1, "Product ID is required"),

  color: z.string().min(3).optional(),

  size: z.string().min(3).optional(),

  sku: z.string().min(3).optional(),

  mrp: numericField("MRP").optional(),

  sellingPrice: numericField("Selling Price").optional(),

  discountPercentage: numericField("Discount").optional(),
});

/* -------------------------------
   REVIEW SCHEMA (FIXED)
-------------------------------- */
export const reviewSchema = z.object({
  product: z.string().min(1, "Product ID is required"),

  title: z.string().min(3, "Title is required"),

  rating: z.coerce
    .number({ invalid_type_error: "Rating must be a number" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  review: z
    .string()
    .trim()
    .min(3, "Review must be at least 3 characters")
    .max(1000, "Review is too long"),
});

/* -------------------------------
   COUPON SCHEMA
-------------------------------- */
export const addCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Coupon code too short")
    .max(50, "Coupon code too long"),

  discountPercentage: z
    .number()
    .nonnegative("Discount must be positive")
    .max(100, "Discount cannot exceed 100%"),

  validity: z.coerce.date({
    errorMap: () => ({ message: "Invalid date" }),
  }),
});

/* -------------------------------
   EXPORT MAIN SCHEMA
-------------------------------- */
export const zSchema = z.object({
  ...authSchema.shape,
  ...productSchema.shape,
  ...reviewSchema.shape,
});