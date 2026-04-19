'use client'
import React from 'react'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'

const Orders = () => {
  return (
    <UserPanelLayout>
      <div className='p-5 bg-white shadow rounded'>
        <h2 className='text-xl font-semibold mb-4'>Orders</h2>
        <p>Your orders will appear here.</p>
      </div>
    </UserPanelLayout>
  )
}

export default Orders