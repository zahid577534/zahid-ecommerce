'use client'
import React from 'react'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
  return (
    <div className='flex lg:flex-nowrap flex-wrap gap-10 lg:px-32 px-5 my-20'>
      
      {/* Sidebar */}
      <div className='lg:w-64 w-full'>
        <UserPanelNavigation />
      </div>

      {/* Content */}
      <div className='flex-1'>
        {children}
      </div>

    </div>
  )
}

export default UserPanelLayout