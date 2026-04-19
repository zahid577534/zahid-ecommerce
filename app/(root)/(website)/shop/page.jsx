'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WebSiteBreadcrumb from '@/components/Application/Website/WebSiteBreadcrumb'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Filter from '@/components/Application/Website/Filter'
import Sorting from '@/components/Application/Website/Sorting'
import { useSearchParams, useRouter } from 'next/navigation'

const Shop = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState([])
  const [limit, setLimit] = useState(9)
  const [sorting, setSorting] = useState('default')
  const [loading, setLoading] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // ✅ FILTER HANDLER
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/shop?${params.toString()}`)
  }

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams(searchParams.toString())
      params.set("limit", limit.toString())
      params.set("sort", sorting)

      const res = await fetch(`/api/shop?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.data.products)
      } else {
        setProducts([])
      }

    } catch (error) {
      console.error(error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [limit, sorting, searchParams.toString()])

  return (
    <div>

      <WebSiteBreadcrumb
        props={{
          title: "Shop",
          links: [{ label: "Shop", href: WEBSITE_SHOP }],
        }}
      />

      <section className="lg:flex lg:px-32 px-4 my-20 gap-6">

        {/* FILTER */}
        <div className="hidden lg:block w-72">
          <div className="sticky top-0 bg-gray-50 p-4 rounded">
            <Filter updateFilter={updateFilter} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-full lg:w-[calc(100%-18rem)]">

          <Sorting
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            mobileFilterOpen={mobileFilterOpen}
            setMobileFilterOpen={setMobileFilterOpen}
          />

          <p className="text-sm text-gray-500 mt-4">
            Showing {products.length} products
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

            {loading ? (
              <p>Loading...</p>
            ) : products.length > 0 ? (
              products.map((item) => (

                // ✅ CLICKABLE PRODUCT
                <Link
                  key={item._id}
                  href={`/product/${item.slug}`}
                  className="border p-3 rounded block hover:shadow-lg hover:scale-[1.02] transition"
                >
                  <Image
                    src={item.images?.[0]?.secure_url || "/placeholder.webp"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-40 object-cover rounded"
                  />

                  <h3 className="mt-2 text-sm font-medium">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Rs {item.minPrice}
                  </p>
                </Link>

              ))
            ) : (
              <p>No products found</p>
            )}

          </div>

        </div>
      </section>
    </div>
  )
}

export default Shop