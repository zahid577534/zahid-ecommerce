export const catchError = (error) => {
  console.error(error);

  return new Response(
    JSON.stringify({
      success: false,
      message: error.message || "Internal Server Error",
    }),
    { status: 500 }
  );
};