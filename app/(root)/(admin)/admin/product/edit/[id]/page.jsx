'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import Image from 'next/image'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toast, ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminRoute'
import { useQueryClient } from '@tanstack/react-query'

const slugify = (text) =>
  text?.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')

const EditProduct = () => {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)

  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
    { href: '', label: 'Edit Product' },
  ]

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      mrp: '',
      sellingPrice: '',
      discountPercentage: '',
      description: '',
      images: [],
    },
  })

  const name = form.watch('name')
  const mrp = form.watch('mrp')
  const sellingPrice = form.watch('sellingPrice')

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/category?deleteType=SD&size=10000')
        if (res.data.success) {
          const options = res.data.data.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))
          setCategoryOption(options)
        }
      } catch (error) {
        toast.error('Failed to fetch categories')
      }
    }
    fetchCategories()
  }, [])

  // Fetch product by ID
  useEffect(() => {
    if (!id) return
    const fetchProduct = async () => {
      try {
        const res = await axios.get('/api/product', { params: { id } })
        if (res.data.success && res.data.data) {
          setInitialData(res.data.data)
          const product = res.data.data
          form.reset({
            name: product.name,
            slug: product.slug,
            category: product.category?._id || '',
            mrp: product.mrp,
            sellingPrice: product.sellingPrice,
            discountPercentage: product.discountPercentage,
            description: product.description,
            images: product.images || [],
          })
          setSelectedMedia(product.images || [])
        }
      } catch (error) {
        console.error('Fetch product error:', error.response?.data ?? error)
        toast.error('Failed to load product')
      }
    }
    fetchProduct()
  }, [id, form])

  // Auto-generate slug
  useEffect(() => {
    form.setValue('slug', name ? slugify(name) : '')
  }, [name, form])

  // Auto-calculate discount
  useEffect(() => {
    const m = parseFloat(mrp)
    const s = parseFloat(sellingPrice)
    if (m > 0 && s >= 0) {
      const discount = ((m - s) / m) * 100
      form.setValue('discountPercentage', Math.max(0, discount).toFixed(2))
    } else {
      form.setValue('discountPercentage', '0')
    }
  }, [mrp, sellingPrice, form])

  // Sync media with form
  useEffect(() => {
    form.setValue('images', selectedMedia)
  }, [selectedMedia, form])

  const removeImage = (id) => {
    setSelectedMedia(selectedMedia.filter((item) => item._id !== id))
  }

  const onSubmit = async (data) => {
    if (!data.description || data.description === '<p></p>') {
      return toast.error('Description is required')
    }

    setLoading(true)
    try {
      const payload = {
        ...data,
        images: selectedMedia.map((item) => item._id),
      }

      const res = await axios.put(`/api/product/edit?id=${id}`, payload)
      if (res.data.success) {
        toast.success('Product updated successfully!')
        queryClient.invalidateQueries({ queryKey: ['product-data'] })
        router.push(ADMIN_PRODUCT_SHOW)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed!')
    } finally {
      setLoading(false)
    }
  }

  if (!initialData) return <p>Loading product...</p>

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <ToastContainer transition={Bounce} />

      <Card>
        <CardHeader className="py-4 px-6 border-b">
          <h2 className="text-xl font-semibold">Edit Product</h2>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-4xl">

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <label className="font-medium text-sm">Product Name</label>
                    <FormControl><Input {...field} placeholder="Enter product name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem>
                    <label className="font-medium text-sm">Slug</label>
                    <FormControl><Input {...field} readOnly className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Category</label>
                  <FormControl>
                    <Select options={categoryOption} selected={field.value} setSelected={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="mrp" render={({ field }) => (
                  <FormItem>
                    <label className="font-medium text-sm">MRP</label>
                    <FormControl><Input type="number" {...field} placeholder="0.00" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="sellingPrice" render={({ field }) => (
                  <FormItem>
                    <label className="font-medium text-sm">Selling Price</label>
                    <FormControl><Input type="number" {...field} placeholder="0.00" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="discountPercentage" render={({ field }) => (
                  <FormItem>
                    <label className="font-medium text-sm">Discount % (Auto)</label>
                    <FormControl><Input type="number" {...field} readOnly className="bg-gray-50" /></FormControl>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <label className="font-medium text-sm">Description</label>
                  <FormControl>
                    <div className="border rounded-md overflow-hidden bg-white">
                      <Editor
                        initialData={field.value}
                        onChange={(event, editor) => field.onChange(editor.getData())}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <label className="font-medium text-sm">Product Images</label>
                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50/50">
                  {selectedMedia.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                      {selectedMedia.map((media) => (
                        <div key={media._id} className="relative group aspect-square border rounded-lg overflow-hidden bg-white">
                          <Image src={media.url || media.secure_url} alt="preview" fill className="object-cover" />
                          <button type="button" onClick={() => removeImage(media._id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors z-10">
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center">
                    <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                      {selectedMedia.length > 0 ? 'Add More Images' : 'Select Images'}
                    </Button>
                    <p className="text-xs text-gray-400 mt-2 italic">Select images from library</p>
                  </div>
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
                {loading ? 'Updating Product...' : 'Update Product'}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default EditProduct