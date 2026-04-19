'use client'

import { darkTheme, lightTheme } from "@/lib/materialTheme";
import { ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Datatable from "@/components/Application/Admin/Datatable";

const DatatableWrapper = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint, // optional
  createAction,
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <Datatable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint} // optional
        createAction={createAction}
      />
    </ThemeProvider>
  );
};

export default DatatableWrapper;