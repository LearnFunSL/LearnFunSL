"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react"; // Assuming you might add icons later

interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon; // Optional icon
  disabled?: boolean;
}

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <ul className="space-y-1">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/admin"); // More robust active check

        return (
          <li key={index}>
            <Link
              href={item.disabled ? "#" : item.href}
              className={`
                flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }
                ${item.disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
              <span className="truncate">{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
