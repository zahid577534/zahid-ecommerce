import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import pageTitle from '@/public/assets/images/page-title.png'
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'

const WebSiteBreadcrumb = ({ title = "Page", links = [] }) => {
  return (
    <div className="relative py-14 flex flex-col justify-center items-center text-center">

      {/* ✅ Background Image */}
      <Image
        src={pageTitle}
        alt="breadcrumb"
        fill
        priority
        className="object-cover -z-10"
      />

      {/* ✅ Overlay (optional for better readability) */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* ✅ Title */}
      <h1 className="text-white text-3xl lg:text-4xl font-bold mb-3">
        {title}
      </h1>

      {/* ✅ Breadcrumb Links */}
      <div className="flex items-center gap-2 text-white text-sm">
        <Link href={WEBSITE_HOME} className="hover:underline">
          Home / Shop
        </Link>

        {links.map((item, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-200">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default WebSiteBreadcrumb