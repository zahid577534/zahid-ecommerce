'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import { logout } from '@/store/reducer/authReducer' // 🔥 FIX MISSING IMPORT

import {
  USER_DASHBOARD,
  USER_PROFILE,
  USER_ORDER,
  WEBSITE_LOGIN
} from '@/routes/WebsiteRoute'

const UserPanelNavigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        '/api/auth/logout',
        {},
        { withCredentials: true } // 🔥 IMPORTANT
      )

      if (!data.success) throw new Error(data.message)

      dispatch(logout())

      // ✅ show message FIRST
      showToast('success', data.message || 'Logged out successfully')

      // ✅ small delay ensures toast appears before redirect
      setTimeout(() => {
        router.replace(WEBSITE_LOGIN)
      }, 300)

    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message)
    }
  }

  const navItem = (href, label) => (
    <Link
      href={href}
      className={`block p-3 text-sm rounded ${
        pathname.startsWith(href)
          ? 'bg-primary text-white'
          : 'hover:bg-primary hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className='border shadow-sm p-4 rounded bg-white'>
      <ul className='space-y-2'>
        <li>{navItem(USER_DASHBOARD, 'Dashboard')}</li>
        
     

        <li>
          <Button
            onClick={handleLogout}
            variant='destructive'
            className='w-full'
          >
            Logout
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default UserPanelNavigation



 //  <li>{navItem(USER_ORDER, 'Orders')}</li> to add order list in dashboard
 //<li>{navItem(USER_PROFILE, 'Profile')}</li>