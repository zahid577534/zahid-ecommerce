import React from 'react'
import logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import Link from 'next/link'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { FaLocationPin, FaPhoneFlip, FaSquareWhatsapp } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>

        {/* Logo + About */}
        <div className='lg:col-span-1 md:col-span-2'>
          <Image
            src={logo}
            width={383}
            height={146}
            alt='logo'
            className='w-36 mb-3'
          />
          <p className='text-gray-500 text-sm leading-6'>
            MA Exports Sialkot is your trusted destination for quality and convenience.
            From fashion essentials to everyday needs, we bring everything you
            need—all in one place.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
<ul className='space-y-2'>
  {['T-Shirts', 'Hoodies', 'Oversized', 'Full Sleeves', 'Polo'].map((item) => (
    <li key={item}>
      <Link
        href={`${WEBSITE_SHOP}?category=${encodeURIComponent(item.toLowerCase())}`}
        className='text-gray-500 hover:text-primary'
      >
        {item}
      </Link>
    </li>
  ))}
</ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Useful Links</h4>
          <ul className='space-y-2'>
            <li><Link href={WEBSITE_HOME} className='text-gray-500 hover:text-primary'>Home</Link></li>
            <li><Link href={WEBSITE_SHOP} className='text-gray-500 hover:text-primary'>Shop</Link></li>
            <li><Link href='about-us' className='text-gray-500 hover:text-primary'>About</Link></li>
            <li><Link href= {WEBSITE_REGISTER} className='text-gray-500 hover:text-primary'>Register</Link></li>
            <li><Link href={WEBSITE_LOGIN} className='text-gray-500 hover:text-primary'>Login</Link></li>
          </ul>
        </div>

        {/* Help Center */}
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
          <ul className='space-y-2'>
            <li><Link href={WEBSITE_REGISTER} className='text-gray-500 hover:text-primary'>Register</Link></li>
            <li><Link href={WEBSITE_LOGIN} className='text-gray-500 hover:text-primary'>Login</Link></li>
            <li><Link href= {USER_DASHBOARD} className='text-gray-500 hover:text-primary'>My Account</Link></li>
            <li><Link href='privacy-policy' className='text-gray-500 hover:text-primary'>Privacy Policy</Link></li>
            <li><Link href='terms-and-conditions' className='text-gray-500 hover:text-primary'>Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
          <ul className='space-y-3'>
            <li className='flex items-center gap-2 text-gray-500'>
              <FaLocationPin size={18}/>
              <span className='text-sm'>MA Exports Sialkot, Pakistan</span>
            </li>

            <li className='flex items-center gap-2 text-gray-500'>
              <FaPhoneFlip size={18}/>
              <Link href='tel:+923314724901' className='text-sm hover:text-primary'>
                +92 331 4724901
              </Link>
            </li>

            <li className='flex items-center gap-2 text-gray-500'>
              <MdEmail size={18}/>
              <Link href='mailto:maexport.sialkot@gmail.com' className='text-sm hover:text-primary'>
                maexport.sialkot@gmail.com
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className='flex gap-4 mt-4 text-gray-600 text-xl'>
            <FaYoutube className='hover:text-red-500 cursor-pointer'/>
            <a 
                href="https://web.facebook.com/profile.php?id=61589094477341" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebook className="hover:text-blue-600 cursor-pointer" />
              </a>
            <a 
        href="https://wa.me/923314724901" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaSquareWhatsapp className="hover:text-green-500 cursor-pointer" />
      </a>
            <FaTwitter className='hover:text-pink-500 cursor-pointer'/>
          </div>
        </div>

      </div>
      <div className='border-t py-6 text-center text-gray-500 text-sm'>
        &copy; {new Date().getFullYear()} MA Exports Sialkot. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer