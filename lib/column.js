import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Chip } from '@mui/material'
import userIcon from '@/public/assets/images/user.png'
import dayjs from 'dayjs'
export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "_id",
    header: "ID",
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: "Category Name",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
    Cell: ({ cell }) =>
      new Date(cell.getValue()).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    enableSorting: true,
    Cell: ({ cell }) =>
      new Date(cell.getValue()).toLocaleString(),
  },
];

// cutomers columns
export const DT_CUSTOMER_COLUMN = [
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.avatar?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'isEmailVerified',
    header: 'Verified',
    cell: ({ row }) =>
      row.original.isEmailVerified ? (
        <Chip color="success" label="Verified" size="small" />
      ) : (
        <Chip color="error" label="Not Verified" size="small" />
      ),
  },
]


//  review columns
export const DT_REVIEW_COLUMN = [
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row }) => row.original.product?._id || 'N/A',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'review',
    header: 'Review',
  },
]