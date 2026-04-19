'use client'

import React from 'react'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { logout } from '@/store/reducer/authReducer'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'

const LogoutButton = ({ simple = false }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { data } = await axios.post('/api/auth/logout')

      if (!data.success) {
        throw new Error(data.message)
      }

      dispatch(logout())
      showToast('success', data.message)
      router.push(WEBSITE_LOGIN)
    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message)
    }
  }

  // ✅ SIMPLE BUTTON (for Header)
  if (simple) {
    return (
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    )
  }

  // ✅ DROPDOWN VERSION (for Admin panel)
  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="text-red-600 cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}

export default LogoutButton