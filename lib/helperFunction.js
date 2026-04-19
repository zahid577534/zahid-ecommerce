
//import { cookies } from "next/headers";

/**
 * Standard API success response 
 * (Using object destructuring for flexibility)
 */
import { NextResponse } from "next/server";

/**
 * Standard API success response 
 */
export const response = (
  success = true,
  statusCode = 200,
  message = "",
  data = null
) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status: statusCode }
  );
};

/**
 * Centralized error response
 */
export const catchError = (error) => {
  console.error("API Error:", error);
  
  let statusCode = error.status || 500;
  let message = error.message || "An unexpected error occurred";

  // Handle MongoDB duplicate key error
  if (error?.code === 11000 && error?.keyValue) {
    const field = Object.keys(error.keyValue)[0];
    message = `Duplicate value for ${field}: ${error.keyValue[field]} already exists.`;
    statusCode = 400;
  }

  return NextResponse.json(
    {
      success: false,
      message,
      cloudinaryError: error.cloudinary || null
    },
    { status: statusCode }
  );
};

/**
 * Auth Check
 */


/**
 * Generate 6-digit OTP
*/
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const columnConfig = (
  columns,
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumns = [...columns];

  if (isCreatedAt) {
    newColumns.push({
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ renderedCellValue }) =>
        renderedCellValue
          ? new Date(renderedCellValue).toLocaleString()
          : "",
    });
  }

  if (isUpdatedAt) {
    newColumns.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ renderedCellValue }) =>
        renderedCellValue
          ? new Date(renderedCellValue).toLocaleString()
          : "",
    });
  }

  if (isDeletedAt) {
    newColumns.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      cell: ({ renderedCellValue }) =>
        renderedCellValue
          ? new Date(renderedCellValue).toLocaleString()
          : "",
    });
  }

  return newColumns;
};

