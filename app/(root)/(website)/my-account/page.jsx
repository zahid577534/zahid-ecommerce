'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebSiteBreadcrumb from '@/components/Application/Website/WebSiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { FaShoppingBag, FaCartPlus } from "react-icons/fa"

const breadCrumbData = {
  title: 'Dashboard',
  links: [{ label: 'Dashboard' }]
}

const MyAccount = () => {
  const { data, loading } = useFetch('/api/dashboard/user')

  const dashboardData = data?.data || {}

  const cart = useSelector((state) => state.cartStore)

  return (
    <div className="p-6">

      <WebSiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className='shadow rounded bg-white'>

          <div className='p-5 text-xl font-semibold border-b'>
            Dashboard
          </div>

          {/* Stats */}
          <div className='p-5'>
            <div className='grid lg:grid-cols-2 gap-6'>

              <div className='flex items-center justify-between border rounded p-4'>
                <div>
                  <h4 className='font-semibold text-lg'>Total Orders</h4>
                  <span className='text-gray-500'>
                    {loading ? '...' : dashboardData.totalOrders || 0}
                  </span>
                </div>
                <FaShoppingBag size={28} />
              </div>

              <div className='flex items-center justify-between border rounded p-4'>
                <div>
                  <h4 className='font-semibold text-lg'>Cart Items</h4>
                  <span className='text-gray-500'>
                    {cart?.products?.length || 0}
                  </span>
                </div>
                <FaCartPlus size={28} />
              </div>

            </div>
          </div>

          {/* Orders */}
          <div className='p-5'>
            <h4 className='text-lg font-semibold mb-3'>Recent Orders</h4>

            <table className='w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2'>#</th>
                  <th className='p-2'>Order ID</th>
                  <th className='p-2'>Items</th>
                  <th className='p-2'>Amount</th>
                  <th className='p-2'>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className='p-4 text-center'>
                      Loading...
                    </td>
                  </tr>
                ) : dashboardData?.recentOrders?.length > 0 ? (
                  dashboardData.recentOrders.map((order, index) => (
                    <tr key={order._id} className='border-t text-center'>
                      <td className='p-2'>{index + 1}</td>
                      <td className='p-2'>{order._id}</td>
                      <td className='p-2'>{order.products?.length || 0}</td>
                      <td className='p-2'>Rs {order.total || 0}</td>
                      <td className='p-2 capitalize'>
                        {order.status || 'pending'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className='p-4 text-center text-gray-500'>
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyAccount