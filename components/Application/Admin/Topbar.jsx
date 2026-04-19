
import React from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Search, Bell, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { RiMen4Fill } from 'react-icons/ri'
import AdminSearch from './AdminSearch'

const Topbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-4">
        {/* The Toggle Button for your Sidebar */}
        <SidebarTrigger />
        
        <div className="hidden md:flex relative w-64 items-center">
         <AdminSearch/>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications & Profile */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 flex h-2 w-2 rounded-full bg-destructive" />
        </Button>
        
        <div className="flex items-center gap-2 pl-2 border-l ml-2">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium leading-none">Admin Name</p>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
          <ThemeSwitch/>
          <UserDropDown/>
          <Button type='button' size='icon' className='ms-2 md:hidden'></Button>
          
        </div>
      </div>
    </header>
  )
}

export default Topbar
