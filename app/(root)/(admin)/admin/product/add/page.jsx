'use client'

import axios from "axios"
import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_PRODUCT_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminRoute'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { toast, ToastContainer, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { useQueryClient } from "@tanstack/react-query"

import useFetch from "@/hooks/useFetch"
import Select from "@/components/Application/Select"
import Editor from "@/components/Application/Admin/Editor"
import MediaModal from "@/components/Application/Admin/MediaModal"

const slugify = (text) =>
  text?.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Product' },
  { href: '', label: 'Add Product' }
]

const AddProduct = () => {
  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const queryClient = useQueryClient()
  const { data: getCategory } = useFetch('/api/category?deleteType=SD&size=10000')

  useEffect(() => {
    if (getCategory?.success) {
      const options = getCategory.data.map((cat) => ({
        label: cat.name,
        value: cat._id
      }))
      setCategoryOption(options)
    }
  }, [getCategory])

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      description: "",
      images: []
    }
  })

  const name = form.watch("name")
  const mrp = form.watch("mrp")
  const sellingPrice = form.watch("sellingPrice")

  useEffect(() => {
    form.setValue("slug", name ? slugify(name) : "")
  }, [name, form])

  // Auto discount
  useEffect(() => {
    const m = parseFloat(mrp)
    const s = parseFloat(sellingPrice)

    if (m > 0 && s >= 0) {
      const discount = ((m - s) / m) * 100
      form.setValue("discountPercentage", Math.max(0, discount).toFixed(2))
    } else {
      form.setValue("discountPercentage", "0")
    }
  }, [mrp, sellingPrice, form])

  // Sync selected media
  useEffect(() => {
    form.setValue("images", selectedMedia)
  }, [selectedMedia, form])

  const onSubmit = async (data) => {
    if (!data.description || data.description === "<p></p>") {
      return toast.error("Description is required")
    }

    setLoading(true)

    try {
      const payload = {
        ...data,
        images: selectedMedia.map(item => item._id)
      }

      const res = await axios.post("/api/product/create", payload)

      if (res.data.success) {
        toast.success("Product added successfully!")
        form.reset()
        setSelectedMedia([])
        queryClient.invalidateQueries({ queryKey: ["product-data"] })
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (id) => {
    setSelectedMedia(prev => prev.filter(item => item._id !== id))
  }

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <ToastContainer transition={Bounce} />

      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <h2 className="text-xl font-semibold">Add Product</h2>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

              {/* NAME + SLUG */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <label>Product Name</label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <label>Slug</label>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              {/* CATEGORY */}
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <label>Category</label>
                  <FormControl>
                    <Select options={categoryOption} selected={field.value} setSelected={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              {/* PRICING */}
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="mrp" render={({ field }) => (
                  <FormItem>
                    <label>MRP</label>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="sellingPrice" render={({ field }) => (
                  <FormItem>
                    <label>Selling Price</label>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="discountPercentage" render={({ field }) => (
                  <FormItem>
                    <label>Discount %</label>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              {/* DESCRIPTION */}
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <label>Description</label>
                  <FormControl>
                    <Editor
                      initialData={field.value}
                      onChange={(event, editor) => {
                        field.onChange(editor.getData())
                      }}
                    />
                  </FormControl>
                </FormItem>
              )} />

              {/* IMAGES */}
              <div>
                <label>Images</label>

                {selectedMedia.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="relative">
                        {/* ✅ FIXED IMAGE SOURCE */}
                        {media.secure_url && (
                          <Image
                            src={media.secure_url}
                            alt={media.alt || "image"}
                            width={150}
                            height={150}
                            className="object-cover rounded"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(media._id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                  Select Images
                </Button>

                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Add Product"}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default AddProduct