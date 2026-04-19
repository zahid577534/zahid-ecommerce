'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/public/assets/images/logo-black.png";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import OTPVerification from "@/components/Application/OTPVerification";
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { ADMIN_DASHBOARD } from "@/routes/AdminRoute";

// ✅ Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [userRole, setUserRole] = useState(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 1️⃣ Login submit → send OTP
  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Login failed");
      }

      toast.success(data.message || "OTP sent to your email");

      // ✅ Dispatch user to Redux
      if (data.user) {
        dispatch(login(data.user));
        setUserRole(data.user.role);
      }

      setOtpSent(true);
      setEmailForOtp(values.email);

    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ OTP Success callback
  const handleOtpSuccess = () => {
    toast.success("OTP verified! Redirecting...");

    const redirectTo = searchParams.get("callback")
      ? searchParams.get("callback")
      : userRole === "admin"
        ? ADMIN_DASHBOARD
        : USER_DASHBOARD;

    setTimeout(() => {
      router.push(redirectTo);
    }, 1500);
  };

  return (
    <>
      <ToastContainer />

      <Card className="w-[450px] mx-auto mt-10">
        <CardContent className="pt-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={Logo}
              width={Logo.width}
              height={Logo.height}
              alt="Logo"
              className="max-w-[150px]"
            />
          </div>

          {/* Title */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold">
              {otpSent ? "Enter OTP" : "Login"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {otpSent
                ? "Enter the OTP sent to your email"
                : "Enter your credentials to continue"}
            </p>
          </div>

          {/* Login Form */}
          {!otpSent ? (
            <form
              onSubmit={form.handleSubmit(handleLoginSubmit)}
              className="space-y-4 mt-6"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  {...form.register("email")}
                  placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <ButtonLoading type="submit" text="Login" loading={loading} />
            </form>
          ) : (
            /* OTP Verification Component */
            <OTPVerification
              email={emailForOtp}
              onSuccess={handleOtpSuccess}
            />
          )}

          {/* Register & Forgot Password Links */}
          {!otpSent && (
            <div className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <Link
                href={WEBSITE_REGISTER}
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
              <div className="text-right mt-1">
                <Link
                  href={WEBSITE_RESETPASSWORD}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LoginPage;