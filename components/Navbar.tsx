"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, HeartPulse, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/departments", label: "Departments" },
  { href: "/book", label: "Book Appointment" },
  { href: "/blog", label: "Blog" },
  { href: "/emergency", label: "Emergency Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <HeartPulse className="h-6 w-6" />
          GH
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium text-slate-600 transition hover:text-primary",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/emergency" className="hidden items-center gap-1.5 text-sm font-semibold text-red-600 md:flex">
          <PhoneCall className="h-4 w-4" />
          Emergency
        </Link>

        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block text-sm font-medium text-slate-600",
                    pathname === link.href && "text-primary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
