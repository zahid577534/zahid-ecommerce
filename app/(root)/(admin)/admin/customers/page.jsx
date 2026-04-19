'use client'

import React, { useMemo, useState } from 'react'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { IconButton, Tooltip } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { showToast } from '@/lib/showToast'
import { useQueryClient } from '@tanstack/react-query'
import { ADMIN_DASHBOARD } from '@/routes/AdminRoute'
import { DT_CUSTOMER_COLUMN } from '@/lib/column'

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Customers' },
]

const ShowCustomers = () => {
  const queryClient = useQueryClient()
  const [exportLoading, setExportLoading] = useState(false)

  const columns = useMemo(() => DT_CUSTOMER_COLUMN, [])

  const handlePermanentDelete = async (ids) => {
    if (!ids || ids.length === 0) {
      showToast('error', 'No ID provided')
      return
    }

    try {
      const res = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      showToast('success', data.message)
      queryClient.invalidateQueries(['customers-data'])
    } catch (error) {
      showToast('error', error.message)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const res = await fetch('/api/customers')
      const json = await res.json()
      if (!json.success) throw new Error(json.message)

      const csvRows = [
        ['Name', 'Email', 'Phone', 'Address', 'Verified'],
        ...json.data.map((c) => [
          c.name,
          c.email,
          c.phone,
          c.address,
          c.isEmailVerified ? 'Verified' : 'Not Verified',
        ]),
      ]

      const csvContent = csvRows.map((e) => e.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'customers.csv'
      a.click()
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setExportLoading(false)
    }
  }

  const createAction = (row) => {
    const id = row?.original?._id
    if (!id) return null

    return [
      <Tooltip key={id} title="Delete Permanently">
        <IconButton
          onClick={() => {
            if (confirm('Are you sure you want to delete this customer?')) {
              handlePermanentDelete([id])
            }
          }}
          size="small"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
      </Tooltip>,
    ]
  }

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="flex justify-end mb-2">
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={exportLoading}
        >
          <FileDownloadIcon />
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <DatatableWrapper
        fetchUrl="/api/customers"
        queryKey="customers-data"
        columnsConfig={columns}
        createAction={createAction}
        deleteEndpoint="/api/customers" // ensures permanent delete works
      />
    </>
  )
}

export default ShowCustomers