import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { ADMIN_CATEGORY_EDIT } from '@/routes/AdminRoute';
const EditAction = ({href}) => {
  return (
    <MenuItem key='edit'>
       <Link href={ADMIN_CATEGORY_EDIT}>
       <ListItemIcon>
        <EditIcon/>
       </ListItemIcon>
       </Link>
       Edit
    </MenuItem>
  )
}

export default EditAction