import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
