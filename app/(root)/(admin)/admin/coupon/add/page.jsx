'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW } from "@/routes/AdminRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Add Coupon" },
];

const AddCoupon = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: { code: "", discountPercentage: "", validity: "" }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        code: data.code,
        discountPercentage: Number(data.discountPercentage),
        validity: data.validity
      };
      const res = await axios.post("/api/coupon", payload);
      if (res.data.success) {
        toast.success(res.data.message);
        form.reset();
        queryClient.invalidateQueries(["coupon-data"]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <ToastContainer transition={Bounce} />
      <Card>
        <CardHeader className="py-4 px-6 border-b"><h2 className="text-xl font-semibold">Add Coupon</h2></CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Coupon Code</label>
                  <FormControl><Input {...field} placeholder="Enter code" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="discountPercentage" render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Discount %</label>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="validity" render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Validity Date</label>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Adding..." : "Add Coupon"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddCoupon;