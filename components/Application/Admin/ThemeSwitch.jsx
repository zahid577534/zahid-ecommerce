'use client'

import React from 'react'
import { useTheme } from 'next-themes' // 1. Added missing import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5"
import { Button } from '@/components/ui/button'

const ThemeSwitch = () => {
  // 2. Hook must be inside the component and invoked with ()
  const { setTheme } = useTheme() 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant="outline" className="cursor-pointer">
          {/* 3. Fixed double quote in className */}
          <IoSunnyOutline className="dark:hidden" />
          <IoMoonOutline className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitch
