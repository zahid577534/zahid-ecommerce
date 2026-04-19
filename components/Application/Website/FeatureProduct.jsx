import React from 'react'
import { FaCircleArrowRight } from "react-icons/fa6"
import Link from 'next/link'
import ProductBox from './ProductBox'

const FeatureProduct = async () => {
  const res = await fetch(
    "http://localhost:3000/api/product/get-featured-product",
    { cache: "no-store" }
  )

  const productData = await res.json()
  const products = productData?.data || []

  return (
    <section className='lg:px-32 px-4 sm:py-10'>
      <div className='flex justify-between items-center mb-5'>
        <h2 className='sm:text-4xl text-2xl font-semibold'>
          Featured Products
        </h2>

        <Link
          href=""
          className='flex items-center gap-2 underline underline-offset-4 hover:text-primary'
        >
          View All <FaCircleArrowRight />
        </Link>
      </div>

      {/* Products Grid */}
      <div className='grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
        {products.map((product) => (
          <ProductBox key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default FeatureProduct