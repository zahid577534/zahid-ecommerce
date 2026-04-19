"use client"

import React, { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BreadCrumb = ({ breadCrumbData }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="mb-5">
        {breadCrumbData?.map((data, index) => {
          const isLast = index === breadCrumbData.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{data.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumb;