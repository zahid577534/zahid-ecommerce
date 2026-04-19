"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import axios from "@/lib/utils"; // ✅ FIXED
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/showToast";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminRoute";

// Breadcrumb
const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Add Category" },
];

// Validation
const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
});

const AddCategory = () => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Auto slug
  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue) {
      form.setValue(
        "slug",
        slugify(nameValue, { lower: true, strict: true })
      );
    }
  }, [nameValue, form]);

  // Submit
  const onSubmit = async (values) => {
    try {
      const res = await axios.post("/api/category/create", values);

      if (res.data.success) {
        showToast("Category created successfully!", "success");

        form.reset();

        // refresh table
        queryClient.invalidateQueries(["category-data"]);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Add Category</h2>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md"
          >
            {/* Name */}
            <div>
              <label>Category Name</label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label>Slug</label>
              <Input {...form.register("slug")} readOnly />
              {form.formState.errors.slug && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <Button type="submit">Add Category</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;