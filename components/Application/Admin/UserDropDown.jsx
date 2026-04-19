'use client'
import React from 'react'
import { useSelector } from 'react-redux';
import Link from 'next/link'; // FIX: Import from next/link
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogoutButton from './LogoutButton';

const UserDropDown = () => {
  // Use optional chaining to prevent crashes if auth is null
  const auth = useSelector((store) => store.authStore.auth);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {/* FIX: Optional chaining */}
          <p className='font-semibold'>{auth?.name || "User"}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin/products/new" className="flex items-center gap-2 cursor-pointer">
              <IoShirtOutline />
              <span>New Product</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/orders' className='flex items-center gap-2 cursor-pointer'>
              <MdOutlineShoppingBag />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <LogoutButton/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown;
