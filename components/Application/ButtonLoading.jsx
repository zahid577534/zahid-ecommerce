"use client"
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ButtonLoading = ({
  type = "button",
  text,
  loading = false,
  className,
  onClick,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={cn("w-full", className)}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;