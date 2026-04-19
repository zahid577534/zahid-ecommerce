'use client'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import Search from '@/components/Application/Website/Search'
import LogoutButton from '@/components/Application/Admin/LogoutButton'

import {
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  USER_DASHBOARD,
  WEBSITE_SHOP
} from '@/routes/WebsiteRoute'

import logo from '@/public/assets/images/logo-black.png'
import userIcon from '@/public/assets/images/user.png'

import { IoMdSearch, IoMdClose } from "react-icons/io"
import { MdAccountCircle } from "react-icons/md"
import { FaBars } from "react-icons/fa6"

import Cart from '@/components/Application/Website/Cart'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

const Header = () => {
  const auth = useSelector(store => store.authStore.auth)

  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-')

const navLinks = [
  { name: 'Home', path: WEBSITE_HOME },
  { name: 'About', path: '/about-us' },
  { name: 'Shop', path: WEBSITE_SHOP },

  { name: 'T-Shirt', path: `${WEBSITE_SHOP}?category=${slugify('T-Shirts')}` },
  { name: 'Hoodies', path: `${WEBSITE_SHOP}?category=${slugify('Hoodies')}` },
  { name: 'Oversized', path: `${WEBSITE_SHOP}?category=${slugify('Oversized')}` },
]

  return (
    <header className='bg-white border-b relative'>

      {/* TOP BAR */}
      <div className='flex justify-between items-center lg:px-32 px-4 py-3 lg:py-5'>

        {/* LOGO */}
        <Link href={WEBSITE_HOME}>
          <Image
            src={logo}
            width={383}
            height={146}
            alt='logo'
            className='lg:w-32 w-24'
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className='hidden lg:block'>
          <ul className='flex items-center gap-10'>
            {navLinks.map((item, i) => (
              <li key={i} className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT SIDE */}
        <div className='flex items-center gap-5'>

          {/* SEARCH */}
          <button
            type='button'
            onClick={() => setShowSearch(prev => !prev)}
          >
            <IoMdSearch
              className='text-gray-500 hover:text-primary cursor-pointer'
              size={25}
            />
          </button>

          {/* CART */}
          <Cart />

          {/* AUTH */}
          {!auth ? (
            <Link href={WEBSITE_LOGIN}>
              <MdAccountCircle className='text-gray-500 hover:text-primary' size={26} />
            </Link>
          ) : (
            <div className='flex items-center gap-3'>
              <Link href={USER_DASHBOARD}>
                <Avatar>
                  <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                </Avatar>
              </Link>

              {/* LOGOUT */}
              <LogoutButton simple />
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className='lg:hidden'
            onClick={() => setIsMobileMenu(true)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-50 transition-transform duration-300 
        ${isMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex justify-between items-center p-4 border-b'>
          <Image src={logo} width={100} height={40} alt='logo' />

          <button onClick={() => setIsMobileMenu(false)}>
            <IoMdClose size={28} />
          </button>
        </div>

        <ul className='flex flex-col gap-6 p-6 text-lg'>
          {navLinks.map((item, i) => (
            <li key={i}>
              <Link
                href={item.path}
                onClick={() => setIsMobileMenu(false)}
                className='text-gray-700 hover:text-primary'
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* SEARCH COMPONENT */}
      <Search isShow={showSearch} setIsShow={setShowSearch} />

    </header>
  )
}

export default Header