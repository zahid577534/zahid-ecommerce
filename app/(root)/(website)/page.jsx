import MainSlider from '@/components/Application/Website/MainSlider'
import React from 'react'
import banner1 from '@/public/assets/images/banner1.png'
import banner2 from '@/public/assets/images/banner2.png'
import AdvertisingBanner from '@/public/assets/images/advertising-banner.png'
import Image from 'next/image'
import Link from 'next/link'
import FeatureProduct from '@/components/Application/Website/FeatureProduct'
import Testimonial from '@/components/Application/Website/Testimonial'
import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { FcOnlineSupport } from "react-icons/fc";
import { MdDiscount } from "react-icons/md";
const Home = () => {
  return (  
    <>
     <section>
    <MainSlider/>
     </section>

     <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-10 gap-4">
    
    {/* Banner 1 */}
    <div className="border rounded-lg overflow-hidden">
      <Link href="#">
        <Image
          src={banner1}
          alt="Banner 1"
          className="w-full h-auto transition-all duration-300 hover:scale-110"
        />
      </Link>
    </div>

    {/* Banner 2 */}
    <div className="border rounded-lg overflow-hidden">
      <Link href="#">
        <Image
          src={banner2}
          alt="Banner 2"
          className="w-full h-auto transition-all duration-300 hover:scale-110"
        />
      </Link>
    </div>

  </div>
</section>
   <FeatureProduct/>

   <section className='lg:px-32 px-4 sm:pt-10 pt-2 pb-5'>
      <Image
        src={AdvertisingBanner} 
        height={AdvertisingBanner.height}
        width={AdvertisingBanner.width}
        alt="Advertising Banner"
        className="w-full h-auto rounded-lg transition-all duration-300 hover:scale-105"
      />
   </section>
   <Testimonial/>

   <section className='bg-gray-50 lg:px-32 px-4 sm:pt-20 border-t py-10'>
  <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10'>

    {/* Returns */}
    <div className='text-center'>
      <p className='flex justify-center items-center mb-3'>
        <GiReturnArrow size={30} className='text-blue-500' />
      </p>
      <h3 className='text-xl font-semibold'>Easy 7-Day Returns</h3>
      <p className='text-gray-600'>
        Shop with confidence knowing you can return items within 7 days hassle-free.
      </p>
    </div>

    {/* Shipping */}
    <div className='text-center'>
      <p className='flex justify-center items-center mb-3'>
        <FaShippingFast size={30} className='text-blue-500' />
      </p>
      <h3 className='text-xl font-semibold'>Fast & Reliable Shipping</h3>
      <p className='text-gray-600'>
        Enjoy quick and dependable delivery right to your doorstep.
      </p>
    </div>

    {/* Support */}
    <div className='text-center'>
      <p className='flex justify-center items-center mb-3'>
        <FcOnlineSupport size={30} />
      </p>
      <h3 className='text-xl font-semibold'>24/7 Customer Support</h3>
      <p className='text-gray-600'>
        Our support team is always available to assist you anytime, anywhere.
      </p>
    </div>

    {/* Discount */}
    <div className='text-center'>
      <p className='flex justify-center items-center mb-3'>
        <MdDiscount size={30} className='text-blue-500' />
      </p>
      <h3 className='text-xl font-semibold'>Exclusive Discounts</h3>
      <p className='text-gray-600'>
        Get access to special offers and deals available only to our customers.
      </p>
    </div>

  </div>
</section>
    </>
  
  )
}

export default Home