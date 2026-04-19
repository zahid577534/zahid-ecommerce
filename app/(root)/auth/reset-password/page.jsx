'use client';
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/public/assets/images/logo-black.png";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Send OTP
  const handleSendOTP = async () => {
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      const res = await fetch(`${window.location.origin}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try { data = await res.json(); } catch { return toast.error("Server did not return JSON"); }

      if (!res.ok) return toast.error(data.message || "Failed to send OTP");

      toast.success(data.message || "OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!email) return toast.error("Email not found");

    try {
      setLoading(true);
      const res = await fetch(`${window.location.origin}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try { data = await res.json(); } catch { return toast.error("Server did not return JSON"); }

      if (!res.ok) return toast.error(data.message || "Failed to resend OTP");

      toast.success(data.message || "OTP resent to your email");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    } finally { setLoading(false); }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Enter OTP and new password");

    try {
      setLoading(true);
      const res = await fetch(`${window.location.origin}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      let data;
      try { data = await res.json(); } catch { return toast.error("Server did not return JSON"); }

      if (!res.ok) return toast.error(data.message || "Failed to reset password");

      toast.success(data.message || "Password reset successfully");

      setTimeout(() => {
        window.location.href = WEBSITE_LOGIN;
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <>
      <ToastContainer />
      <Card className="w-[450px] mx-auto mt-10">
        <CardContent className="pt-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image src={Logo} width={Logo.width} height={Logo.height} alt="Logo" className="max-w-[150px]" />
          </div>

          {/* Title */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold">{otpSent ? "Reset Password" : "Forgot Password"}</h1>
            <p className="text-sm text-muted-foreground">
              {otpSent ? "Enter OTP and your new password" : "Enter your email to receive OTP"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 mt-6">
            {!otpSent ? (
              <>
                <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <ButtonLoading type="button" text="Send OTP" loading={loading} onClick={handleSendOTP} />
              </>
            ) : (
              <>
                <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <div className="flex justify-between items-center">
                  <ButtonLoading type="button" text="Reset Password" loading={loading} onClick={handleResetPassword} />
                  <button type="button" className="text-sm text-blue-600 hover:underline" onClick={handleResendOTP} disabled={loading}>
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ResetPasswordPage;