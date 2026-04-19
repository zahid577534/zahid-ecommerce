'use client';           ///
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/Application/Admin/AppSidebar"
import Topbar from "@/components/Application/Admin/Topbar"
import ThemeProvider from "@/components/Application/Admin/ThemeProvider"

export default function Layout({ children }) {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme = "system"
    enableSystem
    disableTransitionOnChange>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          <Topbar/>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
            <footer className="border-t h-16 flex justify-center items-center bg-gray-50 dark:bg-background text-sm text-muted-foreground">
             &copy; {new Date().getFullYear()} New Fashion Sialkot. All Rights Reserved.
          </footer>
        </main>
      </div>
    </SidebarProvider>
     </ThemeProvider>
  )
}
