import { Assistant } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import GlobalProviders from "@/components/Application/GlobalProviders";

const assistantFont = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${assistantFont.variable} antialiased min-h-screen flex flex-col`}>
        
        {/* GLOBAL PROVIDERS (Redux, Theme, etc.) */}
        <GlobalProviders className="flex-1 min-h-0">
          
          {/* Toast notifications */}
          <ToastContainer position="top-right" autoClose={2000} />

          <div className="flex-1 min-h-0">
            {children}
          </div>

        </GlobalProviders>

      </body>
    </html>
  );
}