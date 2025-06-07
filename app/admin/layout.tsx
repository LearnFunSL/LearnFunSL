import React from "react";
import Link from "next/link";
import { SidebarNav } from "./components/sidebar-nav"; // We'll create this component next

// Define navigation items for the admin panel
export const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard" },
  { title: "User Management", href: "/admin/users" },
  { title: "Content Management", href: "/admin/content" },
  { title: "Resource Manager", href: "/admin/resources" },
  { title: "Notifications", href: "/admin/notifications" },
  { title: "Settings", href: "/admin/settings" },
  { title: "Access Control", href: "/admin/access-control" },
];

// The original content below is removed as it's replaced by the above definition
// export const adminNavItems = [

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/admin"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
          >
            LearnFunSL Admin
          </Link>
        </div>
        <nav className="mt-4 p-2">
          <SidebarNav items={adminNavItems} />
        </nav>
      </aside>
      <div className="flex flex-col flex-1 w-full">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            {/* Add user menu or other header items here */}
            <div>User Menu</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 min-h-[calc(100vh-12rem)]">
            {children}
          </div>
        </main>
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} LearnFunSL Admin Panel
        </footer>
      </div>
    </div>
  );
}
