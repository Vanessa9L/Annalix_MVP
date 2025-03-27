import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "./components/sidebar"
import { UserProvider } from "./components/user-provider"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/use-sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Annalix - LLM Training Platform",
  description: "A platform for training and fine-tuning language models",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isExpanded, isAutoCollapsed } = useSidebar.getState()
  const effectivelyExpanded = isExpanded && !isAutoCollapsed

  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <UserProvider>
          <div className="flex min-h-screen bg-[#fafafa]">
            <Sidebar />
            <main
              className={cn(
                "relative flex-1 transition-[margin] duration-300 ease-in-out",
                "ml-[70px]",
                effectivelyExpanded && "lg:ml-64",
              )}
            >
              <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">{children}</div>
            </main>
          </div>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}



import './globals.css'