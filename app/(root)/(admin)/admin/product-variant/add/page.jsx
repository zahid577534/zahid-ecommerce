'use client'
import { sizes } from "@/lib/utils"
import axios from "axios"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useQueryClient } from "@tanstack/react-query"
import useFetch from "@/hooks/useFetch"
import Select from "@/components/Application/Select"
import MediaModal from "@/components/Application/Admin/MediaModal"
import { ADMIN_PRODUCT_VARIANT_SHOW } from "@/routes/AdminRoute"

const breadCrumbData = [
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variant" },
  { href: "", label: "Add Product Variant" },
]

const AddProductVariant = () => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [productOption, setProductOption] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const { data: getProduct } = useFetch("/api/product?size=10000")

  useEffect(() => {
    if (getProduct?.success) {
      const options = getProduct.data.map((item) => ({
        label: item.name,
        value: item._id,
      }))
      setProductOption(options)
    }
  }, [getProduct])

  const form = useForm({
    defaultValues: {
      product: "",
      sku: "",
      colorName: "",
      colorHex: "#000000",
      size: "",
      stock: 0,
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      finalPrice: 0,
      images: [],
    },
  })

  const mrp = form.watch("mrp")
  const sellingPrice = form.watch("sellingPrice")

  // Auto-calculate discount and final price
  useEffect(() => {
    const m = parseFloat(mrp) || 0
    const s = parseFloat(sellingPrice) || 0

    if (m > 0 && s >= 0) {
      const discount = ((m - s) / m) * 100
      form.setValue("discountPercentage", discount.toFixed(2))
      form.setValue("finalPrice", s.toFixed(2))
    } else {
      form.setValue("discountPercentage", "0")
      form.setValue("finalPrice", "0")
    }
  }, [mrp, sellingPrice, form])

  // Sync selected images
  useEffect(() => {
    form.setValue("images", selectedMedia)
  }, [selectedMedia, form])

  const onSubmit = async (data) => {
    if (!data.colorName) {
      toast.error("Color name is required!")
      return
    }

    setLoading(true)
    try {
      const payload = {
        product: data.product,
        sku: data.sku,
        size: data.size,
        stock: data.stock,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        discountPercentage: data.discountPercentage,
        finalPrice: data.finalPrice,
        color: { name: data.colorName, hex: data.colorHex },
        images: selectedMedia.map((item) => item._id),
      }

      const res = await axios.post("/api/product-variant/create", payload)

      if (res.data.success) {
        toast.success("Variant created successfully!")
        form.reset({
          ...form.defaultValues,
          mrp: 0,
          sellingPrice: 0,
          discountPercentage: 0,
          finalPrice: 0,
        })
        setSelectedMedia([])
        queryClient.invalidateQueries({ queryKey: ["product-variant-data"] })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (id) =>
    setSelectedMedia(selectedMedia.filter((item) => item._id !== id))

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <ToastContainer transition={Bounce} />
      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <h2 className="text-xl font-semibold">Add Product Variant</h2>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-4xl"
            >
              {/* PRODUCT */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">Product*</label>
                    <FormControl>
                      <Select
                        options={productOption}
                        selected={field.value}
                        setSelected={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-medium">SKU*</label>
                    <FormControl>
                      <Input {...field} placeholder="SKU Code" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* COLOR + SIZE */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="colorName"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Color*</label>
                      <FormControl>
                        <Input {...field} placeholder="Red / Blue" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colorHex"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Color Picker</label>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Size*</label>
                      <FormControl>
                        <Select
                          options={sizes.map((s) => ({
                            label: s.label,
                            value: s.values,
                          }))}
                          selected={field.value}
                          setSelected={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* STOCK + PRICE */}
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Stock*</label>
                      <FormControl>
                        <Input type="number" {...field} min={0} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">MRP*</label>
                      <FormControl>
                        <Input type="number" {...field} min={0} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Selling Price*</label>
                      <FormControl>
                        <Input type="number" {...field} min={0} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Discount %</label>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Price After Discount</label>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* IMAGES */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Variant Images</label>
                <div className="border-2 border-dashed p-6 rounded-lg bg-gray-50">
                  {selectedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {selectedMedia.map((media) => (
                        <div
                          key={media._id}
                          className="relative aspect-square border rounded-lg overflow-hidden"
                        >
                          <Image
                            src={media.url || media.secure_url}
                            alt="preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(media._id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    Select Images
                  </Button>
                </div>
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Variant..." : "Add Variant"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default AddProductVariant