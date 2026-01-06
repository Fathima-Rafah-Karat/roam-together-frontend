import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export function LayoutAdmin() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10 flex items-center px-6">
            <SidebarTrigger />
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">
            <Outlet /> {/* Admin routes render here */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
