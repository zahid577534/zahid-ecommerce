import React from 'react'
import Image from 'next/image'
import ImagePlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { PRODUCT_DETAIL } from '@/routes/WebsiteRoute'

const ProductBox = ({ product }) => {
  const imageUrl =
    product?.images?.[0]?.secure_url || ImagePlaceholder.src

  return (
    <div className='border p-3 rounded-lg'>
      <Link href={PRODUCT_DETAIL(product?.slug)}>
      <Image
        src={imageUrl}
        width={400}
        height={400}
        alt={product?.name || "product"}
        className='w-full h-64 object-cover rounded'
      />

      <div className='p-3'>
        <h4>{product?.name}</h4>

        <p className='line-through text-gray-400'>
          ${product?.mrp}
        </p>

        <p className='font-bold'>
          ${product?.sellingPrice}
        </p>
      </div>
      </Link>
    </div>
  )
}

export default ProductBox