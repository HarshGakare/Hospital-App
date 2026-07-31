"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  Building2,
  CalendarCheck,
  Newspaper,
  LogOut,
} from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/blogs", label: "Blog Posts", icon: Newspaper },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-100 bg-white p-4 sm:h-screen sm:w-60 sm:border-b-0 sm:border-r">
      <div className="mb-6 px-2 text-lg font-bold text-primary">Gakare Admin</div>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-50 hover:text-primary",
              pathname.startsWith(link.href) && "bg-primary-50 text-primary"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
