import { ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  if (!row || !row.original?._id) return null; // Safety check

  return (
    <Tooltip title={deleteType === 'PD' ? 'Delete Permanently' : 'Move to Trash'}>
      <MenuItem onClick={() => handleDelete([row.original._id], deleteType)}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Tooltip>
  );
};

export default DeleteAction;