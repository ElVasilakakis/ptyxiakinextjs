import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar" // adjust the import path as needed
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 border-r">
          <AppSidebar />
        </aside>
        {/* Main content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
