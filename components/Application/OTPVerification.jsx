'use client'

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import ButtonLoading from "@/components/Application/ButtonLoading";

// 6-digit OTP schema
const otpSchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const OTPVerification = ({ email, onSuccess }) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const {
    handleSubmit,
    control,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Autofocus first OTP slot
  useEffect(() => {
    setFocus("otp");
  }, [setFocus]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Verify OTP
  const handleVerifyOtp = async (values) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }), // 🔹 pass email
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "OTP verification failed");

      toast.success("OTP verified successfully!");
      if (onSuccess) onSuccess(data);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!email) return toast.error("Email is missing");

    try {
      setIsResending(true);

      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // 🔹 pass email here
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      toast.success(data.message);
      setResendTimer(60); // reset countdown
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-6 mt-6">
      <div className="flex flex-col items-center">
        <label className="block mb-3 text-sm font-medium">Enter 6-digit OTP</label>

        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {errors.otp && <p className="text-red-500 text-xs mt-2">{errors.otp.message}</p>}
      </div>

      <ButtonLoading type="submit" text="Verify OTP" loading={isSubmitting} />

      {/* Resend OTP */}
      <div className="text-center mt-4 text-sm">
        {resendTimer > 0 ? (
          <span className="text-gray-500">Resend OTP in {resendTimer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-primary font-medium hover:underline"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </form>
  );
};

export default OTPVerification;