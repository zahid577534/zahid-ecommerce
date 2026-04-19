import React from 'react'
import { BiCategory } from 'react-icons/bi'
import Link from 'next/link'
import { ADLaM_Display } from 'next/font/google'
import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/routes/AdminRoute'
import { IoShirtOutline } from 'react-icons/io5'
import { RiCoupon2Line } from "react-icons/ri";
import { MdOutlineShoppingBag, MdOutlinePermMedia } from "react-icons/md";
const QuickAdd = () => {
  return (
    <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mt-10'>
  <Link href={ADMIN_CATEGORY_ADD}>
    <div className='flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all
      /* 1. USES CSS VARIABLES FROM YOUR FILE */
      bg-card text-card-foreground border-border
      /* 2. HOVER EFFECT */
      hover:border-green-500/50 hover:shadow-md group'>
        
      <h4 className='font-medium'>Add Category</h4>
      
      <span className='w-12 h-12 flex justify-center items-center rounded-full transition-colors
        /* Icon Circle: Uses a soft background in light, and primary tint in dark */
        bg-secondary text-secondary-foreground
        group-hover:bg-green-600 group-hover:text-white'>
          <BiCategory size={20}/>
      </span>
    </div>
  </Link>
 <Link href={ADMIN_PRODUCT_ADD}>
    <div className='flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all
      /* 1. USES CSS VARIABLES FROM YOUR FILE */
      bg-card text-card-foreground border-border
      /* 2. HOVER EFFECT */
      hover:border-green-500/50 hover:shadow-md group'>
        
      <h4 className='font-medium'>Add PRODUCT</h4>
      
      <span className='w-12 h-12 flex justify-center items-center rounded-full transition-colors
        /* Icon Circle: Uses a soft background in light, and primary tint in dark */
        bg-secondary text-secondary-foreground
        group-hover:bg-green-600 group-hover:text-white'>
          <IoShirtOutline size={20}/>
      </span>
    </div>
  </Link>
  <Link href={ADMIN_COUPON_ADD}>
    <div className='flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all
      /* 1. USES CSS VARIABLES FROM YOUR FILE */
      bg-card text-card-foreground border-border
      /* 2. HOVER EFFECT */
      hover:border-green-500/50 hover:shadow-md group'>
        
      <h4 className='font-medium'>Add Coupon</h4>
      
      <span className='w-12 h-12 flex justify-center items-center rounded-full transition-colors
        /* Icon Circle: Uses a soft background in light, and primary tint in dark */
        bg-secondary text-secondary-foreground
        group-hover:bg-green-600 group-hover:text-white'>
          <RiCoupon2Line size={20}/>
      </span>
    </div>
  </Link>
  <Link href={ADMIN_MEDIA_SHOW}>
    <div className='flex items-center justify-between p-4 rounded-xl shadow-sm border transition-all
      /* 1. USES CSS VARIABLES FROM YOUR FILE */
      bg-card text-card-foreground border-border
      /* 2. HOVER EFFECT */
      hover:border-green-500/50 hover:shadow-md group'>
        
      <h4 className='font-medium'>Add Media </h4>
      
      <span className='w-12 h-12 flex justify-center items-center rounded-full transition-colors
        /* Icon Circle: Uses a soft background in light, and primary tint in dark */
        bg-secondary text-secondary-foreground
        group-hover:bg-green-600 group-hover:text-white'>
          <MdOutlinePermMedia size={20}/>
      </span>
    </div>
  </Link>
  
</div>


  )
}

export default QuickAdd