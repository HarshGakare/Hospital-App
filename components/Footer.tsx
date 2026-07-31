import Link from "next/link";
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            <HeartPulse className="h-6 w-6" />
            GH
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Quality healthcare, delivered with compassion. Book appointments with
            trusted specialists in minutes.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/doctors" className="hover:text-primary">Doctors</Link></li>
            <li><Link href="/departments" className="hover:text-primary">Departments</Link></li>
            <li><Link href="/book" className="hover:text-primary">Book Appointment</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Departments</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Cardiology</li>
            <li>Neurology</li>
            <li>Orthopedics</li>
            <li>Pediatrics</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              123 Wellness Avenue, Medical chowk, Nagpur.
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              +91 7499725914
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              gakareharsh@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Gakare Hospital. All rights reserved.
      </div>
    </footer>
  );
}
